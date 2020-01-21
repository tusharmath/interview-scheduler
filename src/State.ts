/* tslint:disable: max-classes-per-file no-misused-new no-use-before-declare */

import {ID} from './ID'

export class Round {
  public static of(name: string): Round {
    return new Round(name)
  }
  public readonly id = ID.of(Round)
  private constructor(public readonly name: string) {}
}

export class Room {
  public static of(name: string): Room {
    return new Room(name)
  }
  public readonly id = ID.of(Room)
  private constructor(public readonly name: string) {}
}

export class Interviewer {
  public static of(name: string, roundsPrepared: Round[] = []): Interviewer {
    return new Interviewer(
      name,
      roundsPrepared.map(_ => _.id)
    )
  }
  public readonly id = ID.of(Interviewer)
  private constructor(
    public readonly name: string,
    public readonly roundsPrepared: Array<ID<Round>>
  ) {}
}

export class Candidate {
  public static of(name: string, expectedRounds: Round[] = []): Candidate {
    return new Candidate(
      name,
      expectedRounds.map(_ => _.id)
    )
  }
  public readonly id = ID.of(Candidate)
  private constructor(
    public readonly name: string,
    public readonly expectedRounds: Array<ID<Round>>
  ) {}
}

export enum InterviewStatus {
  PROPOSED,
  STARTED,
  ACCEPTED,
  REJECTED
}

export class Interview {
  public static hasCandidate(ii: Interview, candidate: Candidate): boolean {
    return ii.candidate.equals(candidate.id)
  }
  public static hasInterviewer(
    ii: Interview,
    interviewer: Interviewer
  ): unknown {
    return ii.interviewers.some(i => i.equals(interviewer.id))
  }
  public static hasRoom(ii: Interview, room: Room): boolean {
    return ii.room.equals(room.id)
  }
  public static of(
    candidate: Candidate,
    interviewer: Interviewer,
    room: Room
  ): Interview {
    return new Interview(
      candidate.id,
      [interviewer.id],
      room.id,
      InterviewStatus.PROPOSED
    )
  }
  public readonly id = ID.of(Interview)

  private constructor(
    public readonly candidate: ID<Candidate>,
    public readonly interviewers: Array<ID<Interviewer>>,
    public readonly room: ID<Room>,
    public readonly status: InterviewStatus
  ) {}

  public accept(): Interview {
    return this.setStatus(InterviewStatus.ACCEPTED)
  }

  public reject(): Interview {
    return this.setStatus(InterviewStatus.REJECTED)
  }

  public setStatus(status: InterviewStatus): Interview {
    return new Interview(this.candidate, this.interviewers, this.room, status)
  }

  public start(): Interview {
    return this.setStatus(InterviewStatus.STARTED)
  }
}

export class State {
  public static of(): State {
    return new State([])
  }
  private constructor(public readonly interviews: Interview[]) {}
  public addInterview(interview: Interview): State {
    return new State([...this.interviews, interview])
  }

  public canCreateInterview(): (
    candidate: Candidate,
    interviewer: Interviewer,
    room: Room
  ) => boolean {

    // Using Set for perf reasons
    const interviewerSet = new Set(
      this.interviews.flatMap(i => i.interviewers.map(ii => ii.toString()))
    )
    const roomSet = new Set(this.interviews.map(i => i.room.toString()))
    const candidateSet = new Set(
      this.interviews.map(i => i.candidate.toString())
    )

    return (candidate, interviewer, room): boolean =>
      !interviewerSet.has(interviewer.id.toString()) &&
      !roomSet.has(room.id.toString()) &&
      !candidateSet.has(candidate.id.toString())
  }

  public removeInterview(interviewId: ID<Interview>): State {
    return new State(this.interviews.filter(i => !i.id.equals(interviewId)))
  }
}
