import {assert} from 'chai'

import {Candidate, Interview, Interviewer, Room, State} from '../src/state'

describe('Candidate', () => {
  describe('of()', () => {
    it('should create an instance of Candidate', () => {
      const actual = Candidate.of('TUSHAR', [])
      assert.instanceOf(actual, Candidate)
    })
  })
})

describe('Interview', () => {
  describe('hasInterviewer()', () => {
    it('should return true', () => {
      const c0 = Candidate.of('c0')
      const i0 = Interviewer.of('i0')
      const r0 = Room.of('r0')
      const intr0 = Interview.of(c0, i0, r0)

      const actual = Interview.hasInterviewer(intr0, i0)

      assert.isTrue(actual)
    })

    it('should return false', () => {
      const c0 = Candidate.of('c0')
      const i0 = Interviewer.of('i0')
      const i1 = Interviewer.of('i1')
      const r0 = Room.of('r0')
      const intr0 = Interview.of(c0, i0, r0)

      const actual = Interview.hasInterviewer(intr0, i1)

      assert.isFalse(actual)
    })
  })
})
describe('State', () => {
  describe('of()', () => {
    it('should create an instance of State', () => {
      const actual = State.of()
      assert.instanceOf(actual, State)
    })
  })
  describe('addInterview()', () => {
    it('should add new interviews', () => {
      const i0 = Interview.of(
        Candidate.of('c0'),
        Interviewer.of('i0'),
        Room.of('r0')
      )

      const actual = State.of().addInterview(i0).interviews
      const expected = [i0]

      assert.deepStrictEqual(actual, expected)
    })
  })

  describe('removeInterview()', () => {
    it('should remove new interviews', () => {
      const i0 = Interview.of(
        Candidate.of('c0'),
        Interviewer.of('i0'),
        Room.of('r0')
      )

      const actual = State.of()
        .addInterview(i0)
        .removeInterview(i0.id).interviews

      assert.deepStrictEqual(actual, [])
    })
  })

  describe('canTakeInterview()', () => {
    context('interviewer busy', () => {
      it('should return false', () => {
        const c0 = Candidate.of('c0')
        const c1 = Candidate.of('c1')
        const i0 = Interviewer.of('i0')
        const r0 = Room.of('r0')
        const r1 = Room.of('r1')
        const iState = State.of().addInterview(Interview.of(c0, i0, r0))

        const actual = iState.canCreateInterview()(c1, i0, r1)

        assert.isFalse(actual)
      })
    })
    context('candidate busy', () => {
      it('should return false', () => {
        const c0 = Candidate.of('c0')
        const i0 = Interviewer.of('i0')
        const i1 = Interviewer.of('i0')
        const r0 = Room.of('r0')
        const r1 = Room.of('r1')
        const iState = State.of().addInterview(Interview.of(c0, i0, r0))

        const actual = iState.canCreateInterview()(c0, i1, r1)

        assert.isFalse(actual)
      })
    })
    context('room busy', () => {
      it('should return false', () => {
        const c0 = Candidate.of('c0')
        const c1 = Candidate.of('c1')

        const i0 = Interviewer.of('i0')
        const i1 = Interviewer.of('i1')

        const r0 = Room.of('r0')

        const iState = State.of().addInterview(Interview.of(c0, i0, r0))

        const actual = iState.canCreateInterview()(c1, i1, r0)

        assert.isFalse(actual)
      })
    })
  })
})
