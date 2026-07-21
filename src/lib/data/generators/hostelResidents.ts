import type { SeededRandom } from "../prng";
import type { Hostel, HostelResident, Student } from "../types";

export function generateHostelResidents(
  rng: SeededRandom,
  students: Student[],
  hostels: Hostel[],
): HostelResident[] {
  const active = rng.shuffle(students.filter((s) => s.enrollmentStatus === "Active"));
  const residents: HostelResident[] = [];
  let counter = 1;
  let cursor = 0;

  for (const hostel of hostels) {
    const targetOccupancy = Math.round(hostel.capacity * rng.float(0.82, 0.93));
    for (let i = 0; i < targetOccupancy && cursor < active.length; i++, cursor++) {
      const student = active[cursor];
      residents.push({
        id: `BNU-HST-${String(counter).padStart(4, "0")}`,
        studentId: student.id,
        studentName: student.name,
        schoolId: student.schoolId,
        hostelId: hostel.id,
      });
      counter++;
    }
  }

  return residents;
}
