export default () => {
  return {
    descriptions: {
      NO2: {
        title: 'Nitrogendioksid',
        max: '400',
        levels: [
          {
            levelStart: 0,
            levelEnd: 99,
            title: 'Lite',
            health: 'Liten eller ingen helserisiko',
            color: 'green',
            icon: 'sentiment_satisfied'
          },
          {
            levelStart: 100,
            levelEnd: 199,
            title: 'Moderat',
            health: 'Moderat helserisiko',
            color: 'yellow',
            icon: 'sentiment_neutral'
          },

          {
            levelStart: 200,
            levelEnd: 399,
            title: 'Høyt',
            health: 'Betydelig helserisiko',
            color: 'orange',
            icon: 'sentiment_dissatisfied'
          },

          {
            levelStart: 400,
            levelEnd: 1000,
            title: 'Svært høyt',
            health: 'Alvorlig helserisiko',
            color: 'red',
            icon: 'sentiment_very_dissatisfied'
          }
        ]
      },
      "PM2.5": {
        title: 'Svevestøv/partikler',
        max: '150',
        levels: [
          {
            levelStart: 0,
            levelEnd: 24,
            title: 'Lite',
            health: 'Liten eller ingen helserisiko',
            color: 'green',
            icon: 'sentiment_satisfied'
          },
          {
            levelStart: 25,
            levelEnd: 39,
            title: 'Moderat',
            health: 'Moderat helserisiko',
            color: 'yellow',
            icon: 'sentiment_neutral'
          },

          {
            levelStart: 40,
            levelEnd: 149,
            title: 'Høyt',
            health: 'Betydelig helserisiko',
            color: 'orange',
            icon: 'sentiment_dissatisfied'
          },

          {
            levelStart: 150,
            levelEnd: 1000,
            title: 'Svært høyt',
            health: 'Alvorlig helserisiko',
            color: 'red',
            icon: 'sentiment_very_dissatisfied'
          }
        ]
      },
      PM10: {
        title: 'Svevestøv/partikler',
        max: '400',
        levels: [
          {
            levelStart: 0,
            levelEnd: 24,
            title: 'Lite',
            health: 'Liten eller ingen helserisiko',
            color: 'green',
            icon: 'sentiment_satisfied'
          },
          {
            levelStart: 25,
            levelEnd: 39,
            title: 'Moderat',
            health: 'Moderat helserisiko',
            color: 'yellow',
            icon: 'sentiment_neutral'
          },

          {
            levelStart: 40,
            levelEnd: 149,
            title: 'Høyt',
            health: 'Betydelig helserisiko',
            color: 'orange',
            icon: 'sentiment_dissatisfied'
          },

          {
            levelStart: 150,
            levelEnd: 1000,
            title: 'Svært høyt',
            health: 'Alvorlig helserisiko',
            color: 'red',
            icon: 'sentiment_very_dissatisfied'
          }
        ]
      }
    }
  }
}