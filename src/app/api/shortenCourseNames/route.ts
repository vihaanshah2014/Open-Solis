// /api/shortenCourseNames/route.ts

import { NextApiRequest, NextApiResponse } from 'next';

interface CourseData {
  id: number;
  userId: string;
  courseName: string;
  topicsUnderstoodPercentage: number | null;
}

const shortenCourseName = (courseName: string): string => {
  const replacements: { [key: string]: string } = {
    'Financial': 'Fin',
    'Algorithm': 'Algo',
    'Algorithms': 'Algo',
    'Computer': 'Comp',
    'Computing': 'Comp',
    'Analysis': 'Anal',
    'Introduction': 'Intro',
    'Operating': 'Oper',
    'Systems': 'Sys',
    'Numerical': 'Num',
    'Literature': 'Lit'
  };

  const maxLength = 20; // Maximum length for the course name

  let words = courseName.split(' ').map(word => replacements[word] || word);
  let shortenedName = words.join(' ');

  if (shortenedName.length > maxLength) {
    words = words.map(word => word.length > 4 ? word.slice(0, 4) + '.' : word);
    shortenedName = words.join(' ');
  }

  if (shortenedName.length > maxLength) {
    words = words.map(word => word.length > 3 ? word.slice(0, 3) + '.' : word);
    shortenedName = words.join(' ').slice(0, maxLength - 3) + '...';
  }

  if (shortenedName.length < maxLength) {
    const fullWords = courseName.split(' ');
    for (let i = 0; i < fullWords.length && shortenedName.length < maxLength; i++) {
      if (replacements[fullWords[i]]) {
        shortenedName = shortenedName.replace(replacements[fullWords[i]], fullWords[i]);
      } else if (fullWords[i].length > 4) {
        shortenedName = shortenedName.replace(fullWords[i].slice(0, 4) + '.', fullWords[i].slice(0, maxLength - shortenedName.length));
      }
    }
  }

  return shortenedName;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { courses } = req.body;

    if (!courses || !Array.isArray(courses)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Efficient mapping to shorten course names
    const modifiedCourses = courses.map((course: CourseData) => ({
      ...course,
      courseName: shortenCourseName(course.courseName),
    }));

    return res.status(200).json(modifiedCourses);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
