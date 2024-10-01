"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';

interface CourseData {
  id: number;
  userId: string;
  courseName: string;
  topicsUnderstoodPercentage: number | null;
}

const Usage: React.FC = () => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/getCourses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching course data:', error);
      setCourses([
        { id: 1, userId: '1', courseName: 'Physics', topicsUnderstoodPercentage: 85 },
        { id: 2, userId: '1', courseName: 'Chemistry', topicsUnderstoodPercentage: 90 },
        { id: 3, userId: '1', courseName: 'Biology', topicsUnderstoodPercentage: null },
        { id: 4, userId: '1', courseName: 'Math', topicsUnderstoodPercentage: 80 },
        { id: 5, userId: '1', courseName: 'Literature', topicsUnderstoodPercentage: 40 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      'Literature': 'Lit',
      'Mathematics': 'Math',
      'Mathematical': 'Math',
      'Statistics': 'Stats',
      'Statistical': 'Stat',
      'Psychology': 'Psych',
      'Psychological': 'Psych',
      'Biology': 'Bio',
      'Biological': 'Bio',
      'Chemistry': 'Chem',
      'Chemical': 'Chem',
      'Physics': 'Phys',
      'Physical': 'Phys',
      'Engineering': 'Eng',
      'Mechanical': 'Mech',
      'Electrical': 'Elec',
      'Electronic': 'Elec',
      'Economics': 'Econ',
      'Economical': 'Econ',
      'Business': 'Bus',
      'Administration': 'Admin',
      'Management': 'Mgmt',
      'Marketing': 'Mktg',
      'Accounting': 'Acct',
      'Philosophy': 'Phil',
      'Philosophical': 'Phil',
      'Sociology': 'Soc',
      'Sociological': 'Soc',
      'Anthropology': 'Anthro',
      'Anthropological': 'Anthro',
      'Geography': 'Geog',
      'Geographical': 'Geog',
      'Linguistics': 'Ling',
      'Linguistic': 'Ling',
      'Communication': 'Comm',
      'Communications': 'Comm',
      'Information': 'Info',
      'Technology': 'Tech',
      'Environmental': 'Env',
      'Environment': 'Env',
      'Political': 'Pol',
      'Politics': 'Pol',
      'Government': 'Govt',
      'International': 'Intl',
      'Development': 'Dev',
      'Education': 'Edu',
      'Educational': 'Edu',
      'Architecture': 'Arch',
      'Architectural': 'Arch',
      'Agriculture': 'Agri',
      'Agricultural': 'Agri',
      'Veterinary': 'Vet',
      'Medicine': 'Med',
      'Medical': 'Med',
      'Pharmaceutical': 'Pharm',
      'Pharmacy': 'Pharm',
      'Dentistry': 'Dent',
      'Dental': 'Dent',
      'Nursing': 'Nurs',
      'Nutrition': 'Nutr',
      'Nutritional': 'Nutr',
      'Kinesiology': 'Kines',
      'Kinesiological': 'Kines',
      'Physiology': 'Physio',
      'Physiological': 'Physio',
      'Anatomy': 'Anat',
      'Anatomical': 'Anat',
      'Neuroscience': 'Neuro',
      'Neuroscientific': 'Neuro',
      'Microbiology': 'Micro',
      'Microbiological': 'Micro',
      'Biochemistry': 'Biochem',
      'Biochemical': 'Biochem',
      'Genetics': 'Gen',
      'Genetic': 'Gen',
      'Molecular': 'Mol',
      'Cellular': 'Cell',
      'Ecology': 'Eco',
      'Ecological': 'Eco',
      'Evolutionary': 'Evo',
      'Evolution': 'Evo',
      'Astronomy': 'Astro',
      'Astronomical': 'Astro',
      'Astrophysics': 'Astrophys',
      'Geology': 'Geo',
      'Geological': 'Geo',
      'Meteorology': 'Meteo',
      'Meteorological': 'Meteo',
      'Oceanography': 'Ocean',
      'Oceanographic': 'Ocean',
      'Hydrology': 'Hydro',
      'Hydrological': 'Hydro',
      'Seismology': 'Seismo',
      'Seismological': 'Seismo',
      'Paleontology': 'Paleo',
      'Paleontological': 'Paleo',
      'Archaeology': 'Archaeo',
      'Archaeological': 'Archaeo',
      'History': 'Hist',
      'Historical': 'Hist',
      'Journalism': 'Journ',
      'Journalistic': 'Journ',
      'Linguistics': 'Ling',
      'Linguistic': 'Ling',
      'Languages': 'Lang',
      'Language': 'Lang',
      'Literature': 'Lit',
      'Literary': 'Lit',
      'Classical': 'Class',
      'Classics': 'Class',
      'Philosophy': 'Phil',
      'Philosophical': 'Phil',
      'Religion': 'Relig',
      'Religious': 'Relig',
      'Theology': 'Theo',
      'Theological': 'Theo',
      'Anthropology': 'Anthro',
      'Anthropological': 'Anthro',
      'Sociology': 'Soc',
      'Sociological': 'Soc',
      'Psychology': 'Psych',
      'Psychological': 'Psych',
      'Criminology': 'Crim',
      'Criminological': 'Crim',
      'Economics': 'Econ',
      'Economical': 'Econ',
      'Political': 'Pol',
      'Politics': 'Pol',
      'Government': 'Govt',
      'Governmental': 'Govt',
      'International': 'Intl',
      'Global': 'Glob',
      'Diplomacy': 'Dipl',
      'Diplomatic': 'Dipl',
      'Development': 'Dev',
      'Developmental': 'Dev',
      'Geography': 'Geog',
      'Geographical': 'Geog',
      'Urban': 'Urb',
      'Planning': 'Plan',
      'Architecture': 'Arch',
      'Architectural': 'Arch',
      'Design': 'Des',
      'Engineering': 'Eng',
      'Mechanical': 'Mech',
      'Electrical': 'Elec',
      'Electronic': 'Elec',
      'Civil': 'Civ',
      'Chemical': 'Chem',
      'Industrial': 'Ind',
      'Materials': 'Mat',
      'Aerospace': 'Aero',
      'Biomedical': 'Biomed',
      'Environmental': 'Env',
      'Nuclear': 'Nuc',
      'Robotics': 'Robot',
      'Artificial': 'Art',
      'Intelligence': 'Intel',
      'Machine': 'Mach',
      'Learning': 'Learn',
      'Data': 'Dat',
      'Science': 'Sci',
      'Scientific': 'Sci',
      'Analytics': 'Analy',
      'Analytical': 'Analy',
      'Business': 'Bus',
      'Administration': 'Admin',
      'Management': 'Mgmt',
      'Marketing': 'Mktg',
      'Advertising': 'Ad',
      'Finance': 'Fin',
      'Financial': 'Fin',
      'Accounting': 'Acct',
      'Human': 'Hum',
      'Resources': 'Res',
      'Organizational': 'Org',
      'Organization': 'Org',
      'Leadership': 'Lead',
      'Entrepreneurship': 'Entrep',
      'Innovation': 'Innov',
      'Innovative': 'Innov',
      'Strategic': 'Strat',
      'Strategy': 'Strat',
      'Operations': 'Ops',
      'Operational': 'Ops',
      'Logistics': 'Log',
      'Supply': 'Sup',
      'Chain': 'Chn',
      'Production': 'Prod',
      'Quality': 'Qual',
      'Control': 'Ctrl',
      'Project': 'Proj',
      'Program': 'Prog',
      'Programming': 'Prog',
      'Software': 'SW',
      'Hardware': 'HW',
      'Network': 'Net',
      'Networking': 'Net',
      'Security': 'Sec',
      'Database': 'DB',
      'Information': 'Info',
      'Systems': 'Sys',
      'Technology': 'Tech',
      'Technological': 'Tech',
      'Communication': 'Comm',
      'Communications': 'Comm',
      'Telecommunication': 'Telecom',
      'Multimedia': 'Multi',
      'Digital': 'Dig',
      'Electronic': 'E',
      'Virtual': 'Virt',
      'Augmented': 'Aug',
      'Reality': 'Real',
      'Simulation': 'Sim',
      'Modeling': 'Model',
      'Visualization': 'Vis',
      'Graphics': 'Graph',
      'Animation': 'Anim',
      'Gaming': 'Game',
      'Interactive': 'Inter',
      'User': 'Usr',
      'Experience': 'Exp',
      'Interface': 'Interf',
      'Design': 'Des',
      'Cognitive': 'Cog',
      'Behavioral': 'Behav',
      'Experimental': 'Exp',
      'Clinical': 'Clin',
      'Therapeutic': 'Ther',
      'Counseling': 'Couns',
      'Psychotherapy': 'Psycho',
      'Psychiatric': 'Psych',
      'Neurological': 'Neuro',
      'Pharmaceutical': 'Pharm',
      'Biotechnology': 'Biotech',
      'Nanotechnology': 'Nanotech',
      'Quantum': 'Quant',
      'Theoretical': 'Theo',
      'Applied': 'App',
      'Practical': 'Prac',
      'Advanced': 'Adv',
      'Fundamental': 'Fund',
      'Elementary': 'Elem',
      'Intermediate': 'Interm',
      'Professional': 'Prof',
      'Vocational': 'Voc',
      'Technical': 'Tech',
      'Certification': 'Cert',
      'Accreditation': 'Accred',
      'Assessment': 'Assess',
      'Evaluation': 'Eval',
      'Research': 'Res',
      'Development': 'Dev',
      'Innovation': 'Innov',
      'Entrepreneurship': 'Entrep',
      'Leadership': 'Lead',
      'Management': 'Mgmt',
      'Administration': 'Admin',
      'Governance': 'Gov',
      'Policy': 'Pol',
      'Regulation': 'Reg',
      'Compliance': 'Comp',
      'Legal': 'Leg',
      'Judicial': 'Jud',
      'Legislative': 'Legis',
      'Executive': 'Exec',
      'Constitutional': 'Const',
      'Criminal': 'Crim',
      'Civil': 'Civ',
      'Corporate': 'Corp',
      'Commercial': 'Comm',
      'Industrial': 'Ind',
      'Manufacturing': 'Mfg',
      'Production': 'Prod',
      'Construction': 'Const',
      'Infrastructure': 'Infra',
      'Transportation': 'Trans',
      'Logistics': 'Log',
      'Supply': 'Sup',
      'Distribution': 'Dist',
      'Retail': 'Ret',
      'Wholesale': 'Whole',
      'Consumer': 'Cons',
      'Customer': 'Cust',
      'Service': 'Serv',
      'Hospitality': 'Hosp',
      'Tourism': 'Tour',
      'Recreation': 'Rec',
      'Entertainment': 'Ent',
      'Media': 'Med',
      'Journalism': 'Journ',
      'Publication': 'Pub',
      'Editorial': 'Ed',
      'Creative': 'Creat',
      'Artistic': 'Art',
      'Performance': 'Perf',
      'Musical': 'Mus',
      'Theatrical': 'Thea',
      'Cinematic': 'Cin',
      'Photographic': 'Photo',
      'Cultural': 'Cult',
      'Heritage': 'Her',
      'Conservation': 'Conserv',
      'Preservation': 'Pres',
      'Restoration': 'Rest',
      'Sustainability': 'Sustain',
      'Renewable': 'Renew',
      'Alternative': 'Alt',
      'Efficiency': 'Eff',
      'Optimization': 'Opt',
      'Maximization': 'Max',
      'Minimization': 'Min',
      'Reduction': 'Red',
      'Enhancement': 'Enh',
      'Improvement': 'Improv',
      'Innovation': 'Innov',
      'Transformation': 'Trans',
      'Integration': 'Integ',
      'Collaboration': 'Collab',
      'Cooperation': 'Coop',
      'Coordination': 'Coord',
      'Partnership': 'Part',
      'Alliance': 'All',
      'Network': 'Net',
      'Community': 'Comm',
      'Society': 'Soc',
      'Population': 'Pop',
      'Demographic': 'Demo',
      'Geographic': 'Geo',
      'Spatial': 'Spat',
      'Temporal': 'Temp',
      'Chronological': 'Chron',
      'Historical': 'Hist',
      'Contemporary': 'Contemp',
      'Modern': 'Mod',
      'Traditional': 'Trad',
      'Classical': 'Class',
      'Ancient': 'Anc',
      'Medieval': 'Med',
      'Renaissance': 'Ren',
      'Enlightenment': 'Enlight',
      'Revolutionary': 'Rev',
      'Industrial': 'Ind',
      'Technological': 'Tech',
      'Digital': 'Dig',
      'Virtual': 'Virt',
      'Augmented': 'Aug',
      'Artificial': 'Art',
      'Synthetic': 'Synth',
      'Organic': 'Org',
      'Natural': 'Nat',
      'Physical': 'Phys',
      'Chemical': 'Chem'
    };

    const maxLength = 20; // Maximum length for the course name

    let words = courseName.split(' ').map(word => replacements[word] || word);
    let shortenedName = words.join(' ');

    // Truncate words to fit within the maxLength
    if (shortenedName.length > maxLength) {
      words = words.map(word => word.length > 4 ? word.slice(0, 4) + '.' : word);
      shortenedName = words.join(' ');
    }

    // If still too long, reduce further
    if (shortenedName.length > maxLength) {
      words = words.map(word => word.length > 3 ? word.slice(0, 3) + '.' : word);
      shortenedName = words.join(' ').slice(0, maxLength - 3) + '...';
    }

    // Ensure name takes full available space but does not exceed maxLength
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

  const getColorClasses = (percentage: number) => {
    if (percentage >= 90) return ['bg-green-700', 'bg-green-100'];
    if (percentage >= 80) return ['bg-blue-600', 'bg-blue-100'];
    if (percentage >= 70) return ['bg-red-500', 'bg-red-100'];
    if (percentage === 50.01) return ['bg-gray-500', 'bg-gray-100'];
    return ['bg-red-600', 'bg-red-100'];
  };

  return (
    <div className="h-full flex flex-col bg-white text-black rounded p-4 relative font-['MD_Grotesk_Regular']">
      <h1 className="text-2xl font-bold mb-4">Classes</h1>
      <button className="absolute top-2 right-2 flex items-center text-gray-600 hover:text-black" onClick={() => window.location.href = '/courses'}>
        <ArrowRight className="mr-2" />
      </button>
      <div className="flex flex-col space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center animate-pulse">
              <span className="w-24 h-6 bg-gray-300 rounded-lg"></span>
              <div className="flex-grow bg-gray-200 rounded-lg h-7 mx-2">
                <div className="h-7 bg-gray-300 rounded-lg breathing-animation"></div>
              </div>
            </div>
          ))
        ) : (
          courses.map((course) => {
            const shortenedName = shortenCourseName(course.courseName);
            const percentage = course.topicsUnderstoodPercentage ?? 50.01;
            const [fillColor, bgColor] = getColorClasses(percentage);
            return (
              <div key={course.id} className="flex items-center">
                <span className="w-24">{shortenedName}</span>
                <div className={`flex-grow ${bgColor} rounded-lg h-7`}>
                  <div
                    className={`${fillColor} h-7 rounded-lg transition-all duration-300 ease-in-out`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Usage;
