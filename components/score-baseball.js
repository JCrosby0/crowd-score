export class Score {
  /**
     * [ ] Score events
     * [ ] Out
     * [ ] Hit
     * [*] Next batter
     * [*] advance runner
     * [*] runner scores
     * [*] side-out
     * [ ] sub-player
     *
     */
  /**
     * [ ] status / box score
     * [ ] innings number
     * [ ] innings half
     * [ ] outs
     * [ ] base status
     * [ ] R
     * [ ] H
     * [ ] E
     *
     */
  constructor (visitor, home) {
    this.scheduledInnings = 9 // innings
    this.maxGameTime = 2 // hours
    this.gameStartTime = Date.now()
    this.innings = {
      number: 1,
      half: 'top'
    }
    this.teams = {
      home,
      away: visitor
    }
    this.score = {
      away: 0,
      home: 0
    }
    this.runnersOnBases = [null, null, null, null] // ['batter', 'first', 'second', 'third']
    this.currentLineup = {
      top: 1,
      bottom: 1
    }
    this.outs = 0
    this.count = {
      balls: 0,
      strikes: 0
    }
  }

  get currentOffenceTeam () {
    return (this.innings.half === 'top')
      ? this.teams.away
      : (this.innings.half === 'bottom')
          ? this.teams.home
          : 'none'
  }

  get currentDefenceTeam () {
    return (this.innings.half === 'bottom')
      ? this.teams.away
      : (this.innings.half === 'top')
          ? this.teams.home
          : 'none'
  }

  get currentPitcher () {
    const pitchers = this.currentDefenceTeam.pitchers
    return pitchers[pitchers.length - 1]
  }

  get currentBatter () {
    const batter = this.currentOffenceTeam.lineup[this.currentLineup[this.innings.half]]
    return batter
  }

  /** when a pitch is delivered, handle increments */
  pitch (type) {
    this.pitchCount(type)
    this.updateCount(type)
  }

  /** active count for the at bat */
  updateCount (type) {
    switch (type) {
      case 'reset':
        this.count.strikes = 0
        this.count.balls = 0
        break
      case 'strike':
      case 'strike-swinging':
      case 'strike-called':
        this.count.strikes += 1
        if (this.count.strikes >= 3) {
          this.out('strike-out', type)
        }
        break
      case 'ball':
        this.count.balls += 1
        if (this.count.balls >= 4) {
          this.baseOnBalls(type)
        }
        break
      case 'foul-ball':
        if (this.count.strikes < 2) {
          this.count.strikes += 1
        }
        break
      case 'hit-by-pitch':
        this.hitByPitch(type)
    }
  }

  /** record the pitch type against the pitcher's pitchCount */
  pitchCount (type) {
    this.currentPitcher.pitchCount.push(type)
  }

  /**
 * advance batter to first base, next batter, record stats
 * @param {*} type
 */
  baseOnBalls (type) {
    this.advanceRunners(0, 1)
    this.nextBatter()
    this.currentPitcher.stats.bb += 1
    this.currentBatter.stats.bb += 1
  }

  /**
 * advance batter to first base, next batter, record stats
 * @param {*} type
 */
  hitByPitch (type) {
    this.advanceRunners(0, 1)
    this.nextBatter()
    this.currentPitcher.stats.hbp += 1
    this.currentBatter.stats.hbp += 1
  }

  /**
   * called from advanceRunners after check for runners ahead, so no need to check again
     * score the specified runner
     * credit RBI to current batter
     * credit runs to pitcher
     * @param {Number} runner the runnerOnBases index
     *  */
  scoreRunner (runner) {
    // assign run to runner
    this.runnersOnBases[runner].stats.runs += 1
    // assign RBI to batter
    this.runnersOnBases[0].stats.rbi += 1
    // assign run to pitcher
    this.currentPitcher.stats.runs += 1
    //   update game score
    if (this.innings.half === 'top') {
      this.score.away += 1
    } else if (this.innings.half === 'bottom') {
      this.score.home += 1
    }
  }

  /**
     * function to advance runners
     * called by either umpire ruling (passed ball, balk)
     * or hit
     * @param {Number | String} runners Number for which batter should be advanced, or string for cases
     * 'all' advances all runners,
     * 0 advances the batter, eg base on balls
     * 1 advances first base runner, eg stole second
     * if base is occupied, runner will also be moved
     *
     * @param {*} bases
     * @returns null
     */
  advanceRunners (runner = 'all', bases = 1) {
    switch (runner) {
      case 0: // can we treat batter as a runner?
      case 1:
      case 2:
      case 3:
        // check if there's a runner on the specified base
        if (!this.runnersOnBases[runner]) {
          return `no runner on ${runner} to advance`
        }
        // check ahead for any other runners that need to be advanced
        for (let i = Math.min(runner + bases, 3); i > runner; i--) {
          if (this.runnersOnBases[i]) { this.advanceRunners(i, bases) }
        }
        // check if the runner advances enough to score
        if (runner + bases >= 4) {
          this.scoreRunner(runner)
        }
        // advance the runner
        this.runnersOnBases[runner + bases] = this.runnersOnBases[runner]
        // leave the old base empty
        this.runnersOnBases[runner] = null

        // this could be done by array manipulation?
        // where batter is runnersOnBase[0]
        // one base hit => runnersOnBase = [null, ...runnersOnBase]
        // if runnersOnBase.length >= 4 scoreRunners(runnersOnBase.slice(4))
        break
      case 'all':
        for (let i = 3; i >= 0; i--) { this.advanceRunners(i, bases) }
        break
      case 'runners':
        for (let i = 3; i >= 1; i--) { this.advanceRunners(i, bases) }
        break
        // force case (eg base on balls, runners on 1 & 3) is executed by calling advanceRunners(0, 1)
      case 'default':
        break
    }
  }

  out (type, pitch) {
    this.outs += 1
    this.nextBatter()
    if (this.outs >= 3) {
      this.sideOut()
      this.outs = 0
    }
  }

  // call next batter
  nextBatter () {
    //   reset the count agains the batter
    this.updateCount('reset')
    // increment current lineup
    this.currentLineup[this.innings.half] += 1
    this.runnersOnBases[0] = this.currentOffenceTeam.lineup[this.currentLineup[this.innings.half]]
  }

  // 3 outs - side away
  sideOut () {
    if (this.checkGameOver(this.innings.half === 'top')) { return }
    if (this.innings.half === 'bottom') {
      this.innings.number += 1
    }
    this.innings.half = (this.innings.half === 'top') ? 'bottom' : 'top'
  }

  checkGameOver (inningsInProgress = true) {
    /**
         * conditions for end of game:
         * - time elapsed
         * - end of 9th, scores unequal
         * - middle of 9th, home team ahead
         * */
    //
    // time elapsed
    if (!inningsInProgress) {
      if ((Date.now() - this.gameStartTime) > this.gameLength * 60 * 60 * 1000) { return true }
    }
    // end of 9th, scores unequal
    if (this.innings.number >= 9 &&
          this.innings.half === 'bottom' &&
        this.score.away !== this.score.home) { return true }
    // middle of 9th, home team ahead
    if (this.innings.number >= 9 &&
          this.innings.half === 'top' &&
        this.score.away < this.score.home) { return true }
    // else return false, game continues
    return false
  }
}

class Player {
  constructor (name, uniform = undefined) {
    this.name = name
    this.uniform = uniform
  }

    return
}

class Fielder extends Player {
  constructor (name, uniform = undefined, position = 0) {
    super(name, uniform)
    // this.name = name
    this.position = position
  }
}

class Batter extends Player {
  constructor (name, uniform = undefined) {
    super(name, uniform)
    // this.name = name
    this.stats = {
      runs: 0,
      rbi: 0,
      hbp: 0,
      bb: 0
    }
  }
}

class Pitcher extends Player {
  constructor (name, uniform = undefined) {
    super(name, uniform)
    // this.name = name
    this.pitchCount = []
    this.positon = 1
    this.stats = {
      runs: 0,
      hbp: 0,
      bb: 0
    }
  }

  // getters
  get strikes () {
    return this.countPitches('strike')
  }

  get balls () {
    return this.countPitches('ball')
  }

  get pitches () {
    return this.countPitches()
  }

  // methods
  countPitches (type = 'all') {
    return this.pitchCount
      .filter((pitch) => {
        return pitch === 'all'
          ? true
          : pitch.contains(type)
      })
      .length
  }
}

export class Team {
  constructor (teamName) {
    this.name = teamName
    this.lineup = []
    this.players = []
    this.fielders = new Array(10)
    this.pitchers = []
  }

  addCoach (name) {
    this.coach = name
  }

  addManager (name) {
    this.manager = name
  }

  addPlayer (name, uniform) {
    this.players.push(new Player(name, uniform))
  }

  addPitcher (name) {
    this.pitchers.push(new Pitcher(name))
  }

  addBatter (name) {
    this.lineup.push(new Batter(name))
  }

  addFielder (name, position = 'next') {
    const index = (position === 'next')
      ? this.fielders.indexOf(undefined)
      : position
    this.fielders[index] = new Fielder(name, index)
  }

  get teamList () {
    return this.players
  }
}

// module.exports = [
//   Score,
//   Player,
//   Fielder,
//   Batter,
//   Pitcher,
//   Team
// ]
