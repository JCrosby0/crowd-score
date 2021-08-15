// import { mount } from '@vue/test-utils'
import { Score, Team } from '@/components/score-baseball.js'

const nameAwayTeam = 'Awayville Wayfarers'
const nameHomeTeam = 'Hometown Homers'
const players = [
  'Adam the Ant',
  'Bob the Buffallo',
  'Chad the Cheetah',
  'Dan the Dingbat',
  'Ed the Echidna',
  'Fred the Fly',
  'Gaz the Goat',
  'Harry the Hippo',
  'Ian the Iguana',
  'Johh the Jaguar',
  'Karl the Kingfisher',
  'Larry the Lion',
  'Morris the Meerkat',
  'Nancy the Numbat',
  'Oliver the Orangutan',
  'Percy the Pelican',
  'Quincy the Quokka',
  'Roger the Rabbit',
  'Simon the Snake',
  'Tim the Tiger',
  'Urgot the Unicorn',
  'Varry the Violin',
  'Woger the Wabbit',
  'Xavier the Xylophone',
  'Youngun the Yodeler',
  'Zarry the Zebra'

]

describe('team class', () => {
  const homeTeam = new Team(nameHomeTeam)
  const awayTeam = new Team(nameAwayTeam)
  test('team class', () => {
    expect(homeTeam).toBeTruthy()
    expect(homeTeam.name).toBe(nameHomeTeam)
    expect(homeTeam.players.length).toBe(0)
    expect(homeTeam.lineup.length).toBe(0)
    expect(homeTeam.fielders.length).toBe(10)
    expect(homeTeam.pitchers.length).toBe(0)
    expect(awayTeam).toBeTruthy()
  })
  test('add staff to team', () => {
    homeTeam.addCoach(players[21])
    homeTeam.addManager(players[22])
    expect(homeTeam.coach).toBe(players[21])
    expect(homeTeam.manager).toBe(players[22])
  })
  test('add players to team', () => {
    for (let i = 0; i < 10; i++) {
      homeTeam.addPlayer(players[i], i + 1)
      awayTeam.addPlayer(players[i + 10], i + 11)
    }
    expect(homeTeam.teamList.length).toBe(10)
    expect(awayTeam.teamList.length).toBe(10)
  })
  test('add pitchers to teams', () => {
    homeTeam.addPitcher(players[0])
    awayTeam.addPitcher(players[10])
    expect(homeTeam.pitchers.length).toBe(1)
    expect(awayTeam.pitchers.length).toBe(1)
  })
  test('add batters to teams', () => {
    // do something silly to test the lineup
    for (let i = 0; i < 70; i += 7) {
      homeTeam.addBatter(players[i % 10])
      awayTeam.addBatter(players[i % 10 + 10])
    }
    expect(homeTeam.lineup.length).toBe(10)
    expect(awayTeam.lineup.length).toBe(10)
  })
  test('add fielders to teams', () => {
    // do something silly to test the lineup
    for (let i = 0; i < 9; i++) {
      homeTeam.addFielder(players[(i * 3) % 10], i + 1)
      awayTeam.addFielder(players[(i * 3) % 10 + 10], i + 1)
    }
    expect(homeTeam.fielders.length).toBe(10)
    expect(awayTeam.fielders.length).toBe(10)
    expect(homeTeam.fielders[0]).toBeFalsy()
    expect(homeTeam.fielders[1]).toBeTruthy()
  })
  const score = new Score(awayTeam, homeTeam)
  test('score class', () => {
    expect(score).toBeTruthy()
  })
  test('get Teams', () => {
    expect(score.currentOffenceTeam.name).toBe(nameAwayTeam)
    expect(score.currentDefenceTeam.name).toBe(nameHomeTeam)
  })
  test('advance innings, currentPitcher, currentBatter', () => {
    const homePitcher = score.currentPitcher
    score.out('strike-out', 'swinging')
    const batterA = score.currentBatter
    score.out('strike-out', 'swinging')
    const batterB = score.currentBatter
    expect(batterA.name).not.toBe(batterB.name)
    score.out('strike-out', 'swinging')
    expect(score.currentOffenceTeam.name).toBe(nameHomeTeam)
    expect(score.currentDefenceTeam.name).toBe(nameAwayTeam)
    expect(score.innings.half).toBe('bottom')
    const awayPitcher = score.currentPitcher
    expect(homePitcher.name).not.toBe(awayPitcher.name)
    score.out('strike-out', 'swinging')
    score.out('strike-out', 'swinging')
    score.out('strike-out', 'swinging')
    expect(score.innings.half).toBe('top')
    expect(score.innings.number).toBe(2)
  })
  test('pitch counts', () => {
    // expect all counts to be zero
    expect(score.count.balls).toBe(0)
    expect(score.count.strikes).toBe(0)
    expect(score.outs).toBe(0)
    // test a ball
    score.pitch('ball')
    expect(score.count.balls).toBe(1)
    // test a strike
    score.pitch('strike')
    expect(score.count.strikes).toBe(1)
    score.pitch('foul-ball')
    expect(score.count.strikes).toBe(2)
    // test that a foul-ball doesn't register an out
    score.pitch('foul-ball')
    expect(score.count.strikes).toBe(2)
    expect(score.outs).toBe(0)
    // test that 3rd strike is an out
    score.pitch('strike')
    expect(score.count.strikes).toBe(0)
    expect(score.count.balls).toBe(0)
    expect(score.outs).toBe(1)
    // test that 4 balls is a base on balls
    score.pitch('ball')
    score.pitch('ball')
    score.pitch('ball')
    expect(score.count.balls).toBe(3)
    const batterA = score.currentBatter
    score.pitch('ball')
    expect(score.count.balls).toBe(0)
    const batterB = score.currentBatter
    expect(batterA).not.toBe(batterB)
  })
  test('advancing runners', () => {
    // runner on first from base on balls
    expect(score.runnersOnBases[1]).toBeTruthy()
    expect(score.runnersOnBases[2]).toBeFalsy()
    // runner steals second
    score.advanceRunners(1, 1)
    expect(score.runnersOnBases[2]).toBeTruthy()
    expect(score.runnersOnBases[1]).toBeFalsy()
    // advance batter via Hit By Pitch
    score.pitch('hit-by-pitch')
    expect(score.runnersOnBases[0]).toBeTruthy()
    expect(score.runnersOnBases[1]).toBeTruthy()
    expect(score.runnersOnBases[2]).toBeTruthy()
    expect(score.runnersOnBases[3]).toBeFalsy()
    // two runners steal
    score.advanceRunners(1, 1)
    expect(score.runnersOnBases[0]).toBeTruthy()
    expect(score.runnersOnBases[1]).toBeFalsy()
    expect(score.runnersOnBases[2]).toBeTruthy()
    expect(score.runnersOnBases[3]).toBeTruthy()
    // steal home
    const scoreBefore = score.score.home + score.score.away
    const scoringRunner = score.runnersOnBases[3]
    score.advanceRunners(3, 1)
    expect(score.runnersOnBases[0]).toBeTruthy()
    expect(score.runnersOnBases[1]).toBeFalsy()
    expect(score.runnersOnBases[2]).toBeTruthy()
    expect(score.runnersOnBases[3]).toBeFalsy()
    const scoreAfter = score.score.home + score.score.away
    expect(scoreAfter > scoreBefore).toBeTruthy()
    expect(score.currentPitcher.stats.runs).toBe(1)
    expect(scoringRunner.stats.runs).toBe(1)
    expect(score.currentBatter.stats.rbi).toBe(1)
  })
})
