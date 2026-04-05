import { jobEstimatorPreview } from '../utils/jobEstimatorPreview'

const projects = [
  {
    name: 'Your Best Week Yet',
    featured: true,
    description: [
      'Built for Mohawk Valley Wellness, "Your Best Week Yet" automates data collection for our customer\'s fitness program.',
    ],
    details: 'Users need only log in daily and answer a handful of qestions to track their health. The data gets uploaded and allows our customer to monitor the progress for his fitness programs all across the wider Finger Lakes region.',
    theme: {
      primary: '#fafafaff',
      secondary: '#22c55e',
      text: '#801D18',
    },
    links: {
      googlePlay: 'https://play.google.com/store/apps/details?id=com.skyforgedsoftware.bestweek&hl=en',
      ios: 'https://apps.apple.com/us/app/your-best-week-yet/id6753602394',
      website: 'https://mohawkvalleywellness.com/newsletter/',
    },
    media: [
      {
        type: 'video',
        src: '/YBWY/YBWY Promo v2 (no subtitles).mp4',
        label: 'Pure App Video'
      },
      {
        type: 'image',
        src: '/YBWY/YBWY-DASHBOARD.png',
        label: 'Login Dashboard'
      },
      {
        type: 'image',
        src: '/YBWY/YBWY-WEIGHTENTRY.png',
        label: 'Daily Weight Entry Screen'
      },
      {
        type: 'image',
        src: '/YBWY/YBWY-LEADERBOARDS.png',
        label: 'Leaderboards'
      },
      {
        type: 'image',
        src: '/YBWY/YBWY-WEIGHT-GRAPH.png',
        label: 'Weight Tracking'
      },
      {
        type: 'image',
        src: '/YBWY/YBWY-ADMIN-CONSOLE.png',
        label: 'Customer Administrative Console'
      },
    ],
  },
  {
    name: 'Contractor Job Estimator Sketchup',
    featured: false,
    description: [
      'Sketchup of a template contractor job estimator.',
      'Runs in the browser, saves locally, and exports a spreadsheet-friendly CSV for Excel, Numbers, or Google Sheets.',
    ],
    details: 'Not a full product but this serves as a 1 hour mochup.',
    theme: {
      primary: '#ECFDF5',
      secondary: '#047857',
      text: '#052E16',
    },
    links: {
      demo: '/projects/job-estimator',
    },
    media: [
      {
        type: 'image',
        src: jobEstimatorPreview,
        label: 'Estimator preview',
      },
    ],
  },
  {
    name: 'Cyberpunk 2020 Monthly Ledger',
    featured: false,
    description: [
      'A browser-based monthly tracker for crew income, recurring bills, one-off expenses, and current stash.',
      'The current version autosaves locally, exports CSV, prints cleanly, and links back to the hosted Cyberpunk 2020 PDF for quick rules reference.',
    ],
    details: '\"Back in the day I’d Stuffit to the ripperdoc for some free hydro. Now you got a keyboard trackin your clams? That chilled.\" - Cybermike',
    theme: {
      primary: '#000000',
      secondary: '#ffffff',
      text: '#ff0000',
    },
    links: {
      demo: '/projects/cyberpunk-ledger',
      download: '/pdfs/cyberpunk2020.pdf',
    },
    media: [
      {
        type: 'image',
        src: 'Cyberpunk/nightcityhuge-900x533.jpg',
        label: 'Cyberpunk 2020 ledger download card',
      },
      {
        type: 'image',
        src: 'Cyberpunk/cybered_up.PNG',
        label: 'Cyberpunk 2020 ledger download card',
      },
      {
        type: 'image',
        src: 'Cyberpunk/glass_eyes.PNG',
        label: 'Cyberpunk 2020 ledger download card',
      },
      {
        type: 'image',
        src: 'Cyberpunk/high_society.PNG',
        label: 'Cyberpunk 2020 ledger download card',
      },
      {
        type: 'image',
        src: 'Cyberpunk/johnny_silverhand.PNG',
        label: 'Cyberpunk 2020 ledger download card',
      },
      {
        type: 'image',
        src: 'Cyberpunk/new_arm.PNG',
        label: 'Cyberpunk 2020 ledger download card',
      },
    ],
  },
]

export default projects
