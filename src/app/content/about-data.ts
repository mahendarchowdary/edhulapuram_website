export const aboutPageData = {
  basicInfo: [
    { label: 'Upgraded to Municipality', value: '2025', icon: 'Calendar' },
    { label: 'Area (Sq. km)', value: 69.771, icon: 'AreaChart' },
    { label: 'Population (2011)', value: 41028, icon: 'Users' },
    { label: 'Present Population', value: 58647, icon: 'Users' },
    { label: 'Wards', value: 32, icon: 'Map' },
    { label: 'Households', value: 19968, icon: 'Home' },
    { label: 'Male Population', value: 21808, icon: 'Contact' },
    { label: 'Female Population', value: 19220, icon: 'Contact' },
  ],
  mergedVillages: [
    'Barugudem', 'China Venkatagiri', 'Edulapuram', 'Gollagudem', 
    'Gudimalla', 'Gurralapadu', 'Maddulapalli', 'Muthagudem', 
    'Pedda Thanda', 'Polepalli-Part', 'Pallegudem-Part (Reddypalli)', 
    'Teldarupalli'
  ],
  infrastructure: {
    roads: {
      title: 'Road Network',
      icon: 'Car',
      details: {
        'C.C. Roads': '275.50 KM',
        'B.T. Roads': '57.25 KM',
        'WBM/Metal Roads': '27.91 KM',
        'Motorable Kutcha': '102.92 KM',
        'Total Length': '463.58 KM',
      },
    },
    drains: {
      title: 'Drainage System',
      icon: 'Wind',
      details: {
        'Pakka Drains': '91.15 KM',
        'Kutcha Drains': '196.00 KM',
        'Total Drains': '287.15 KM',
      },
    },
    water: {
      title: 'Water Supply',
      icon: 'Droplets',
      details: {
        'Tap Connections': '12,941',
        'Total Demand': '4.25 MLD',
        'Present Supply': '4.10 MLD',
        'Power Bore Wells': '53',
        'Hand Bore Wells': '272',
      },
    },
    streetLights: {
      title: 'Street Lighting',
      icon: 'Lightbulb',
      details: {
        'LED Lights': '4,954',
        'Tube Lights': '576',
        'Bulbs': '6,028',
        'Central Lights': '409',
        'Total Lights': '11,967',
      },
    },
  },
  sanitation: {
    stats: [
      { label: 'Garbage Generated/Day', value: '2.3 tons', icon: 'Trash2' },
      { label: 'Door to Door Collection', value: '95%', icon: 'Home' },
      { label: 'Outsourced Sweepers', value: 124, icon: 'Users' },
      { label: 'GPS Fitted Vehicles', value: 25, icon: 'CheckCircle' },
    ],
    vehicles: {
      tractors: 15,
      swatch_autos: 10,
      fogging_machines: 6,
      dozer: 1,
    },
  },
  financials: {
    revenue: {
      data: [
        { name: 'Taxes', Demand: 821.29, Collection: 78.65, Balance: 742.64 },
      ],
      assessments: 20038,
    },
    account: {
      income: 2050.56,
      expenditure: 2048.93,
    },
    lrs: {
      applications: 13618,
      fee_collected: '12.56 cr',
      proceedings_issued: 221,
    },
  },
  communityAssets: [
    { label: 'High Schools', value: 12, icon: 'University' },
    { label: 'Primary Schools', value: 26, icon: 'University' },
    { label: 'Colleges', value: 6, icon: 'University' },
    { label: 'Primary Health Centers', value: 4, icon: 'Heart' },
    { label: 'Private Hospitals', value: 2, icon: 'Heart' },
    { label: 'Community Halls', value: 4, icon: 'Building' },
    { label: 'Lakes & Tanks', value: 11, icon: 'Droplets' },
    { label: 'Parks & Playgrounds', value: 25, icon: 'TreePine' },
    { label: 'Nurseries', value: 10, icon: 'TreePine' },
    { label: 'Indiramma Houses', value: 513, icon: 'Home' },
    { label: 'SHG Groups', value: 926, icon: 'Users' },
    { label: 'Agriculture Market', value: 1, icon: 'LandPlot' },
  ],
};
