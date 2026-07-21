import type { SeededRandom } from "../prng";
import type { Gender } from "../types";

const MALE_FIRST_NAMES = [
  "Ahmed", "Ali", "Hassan", "Hussain", "Bilal", "Usman", "Umar", "Zain", "Faisal",
  "Shahzad", "Imran", "Kamran", "Adnan", "Waseem", "Tariq", "Asad", "Junaid", "Rizwan",
  "Fahad", "Hamza", "Talha", "Saad", "Danish", "Farhan", "Shoaib", "Nabeel", "Arslan",
  "Haris", "Yasir", "Owais", "Sami", "Zeeshan", "Mustafa", "Salman", "Kashif", "Raza",
  "Abbas", "Sarmad", "Awais", "Moiz", "Ibrahim", "Yousaf", "Noman", "Qasim", "Shayan",
  "Daniyal", "Ahsan", "Wajahat", "Sohail", "Adeel", "Aamir", "Naveed", "Rehan", "Taimoor",
  "Basit", "Hamid", "Jawad", "Khizer", "Mohsin", "Sikandar",
];

const FEMALE_FIRST_NAMES = [
  "Ayesha", "Fatima", "Zainab", "Sana", "Mahnoor", "Hira", "Sara", "Amna", "Iqra",
  "Komal", "Nida", "Rabia", "Saba", "Sadia", "Warda", "Anum", "Bushra", "Faiza",
  "Hina", "Javeria", "Kinza", "Laiba", "Maha", "Mariam", "Mehak", "Nadia", "Noor",
  "Palwasha", "Qurat", "Rida", "Sidra", "Tehreem", "Urwa", "Wafa", "Zara", "Aleena",
  "Amina", "Anaya", "Areeba", "Asma", "Ayla", "Dua", "Eman", "Fariha", "Ghazal",
  "Hamna", "Haleema", "Insia", "Javeria", "Kanwal", "Khadija", "Mahjabeen", "Marium",
  "Minahil", "Momina", "Nimra", "Rimsha", "Sabahat", "Tuba", "Yumna", "Zoya",
];

const LAST_NAMES = [
  "Khan", "Ahmed", "Malik", "Chaudhry", "Butt", "Sheikh", "Qureshi", "Siddiqui",
  "Farooq", "Raza", "Hussain", "Abbasi", "Baig", "Awan", "Cheema", "Dar", "Gill",
  "Iqbal", "Javed", "Kiani", "Lodhi", "Mirza", "Niazi", "Pasha", "Rana", "Satti",
  "Tariq", "Warraich", "Yousafzai", "Zaidi", "Bhatti", "Chandio", "Durrani", "Ghauri",
  "Hashmi", "Jafri", "Kazmi", "Leghari", "Mughal", "Nawaz", "Qazi", "Rizvi", "Soomro",
  "Tahir", "Umar", "Wattoo", "Alvi", "Bukhari", "Farrukh", "Ghumman",
];

export function generateGender(rng: SeededRandom): Gender {
  return rng.bool(0.52) ? "Male" : "Female";
}

export function generatePersonName(rng: SeededRandom, gender: Gender): string {
  const first = gender === "Male" ? rng.pick(MALE_FIRST_NAMES) : rng.pick(FEMALE_FIRST_NAMES);
  const last = rng.pick(LAST_NAMES);
  return `${first} ${last}`;
}
