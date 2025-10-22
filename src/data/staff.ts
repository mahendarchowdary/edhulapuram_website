export type StaffMemberSeed = {
  name: string;
  designation: string;
  phone?: string;
  priority: number;
};

const staffSeed: StaffMemberSeed[] = [
  { name: "N. Mani", designation: "Manager (I/C)", phone: "", priority: 1 },
  { name: "K. Sridhar Reddy", designation: "R.O (I/C)", phone: "", priority: 2 },
  { name: "N. Raghu", designation: "R.I Revenue Inspector (I/C)", phone: "", priority: 2.2 },
  { name: "M. Babu", designation: "A.E (Engineer)", phone: "", priority: 3 },
  { name: "Sathish", designation: "TPO", phone: "", priority: 4 },
  { name: "D. Kiran", designation: "SI Sanitary Inspector (I/C)", phone: "", priority: 5 },
  { name: "P. Srinivas", designation: "Sanitary Incharge (I/C)", phone: "", priority: 5.2 },
  { name: "K. Madhu", designation: "Water Incharge (I/C)", phone: "", priority: 6 },
  { name: "P. Usha Rani", designation: "Electric Incharge (I/C)", phone: "", priority: 7 },
  { name: "Y. Suvarna Uma", designation: "MEMPA (I/C)", phone: "", priority: 8 },
  { name: "Ambati Vinay", designation: "IT Wing", phone: "", priority: 9 },
];

export default staffSeed;
