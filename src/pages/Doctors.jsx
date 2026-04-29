// src/pages/Doctors.jsx - Professional Doctor Images
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

const Doctors = () => {
  const { user } = useAuth();
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    maxFee: 500,
    experience: 'all',
    gender: 'all'
  });

  // PROFESSIONAL DOCTORS DATA WITH REALISTIC IMAGES
  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      specialtyId: 'cardiology',
      experience: 15,
      rating: 4.9,
      reviews: 1250,
      fee: 150,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
      availability: ['Monday', 'Wednesday', 'Friday'],
      timeSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'],
      education: 'MD, Cardiology - Harvard Medical School',
      languages: ['English', 'Spanish'],
      about: 'Board-certified cardiologist with 15+ years of experience in interventional cardiology and heart disease prevention. Published researcher in leading medical journals.',
      achievements: [
        'Best Cardiologist Award 2023',
        'American Heart Association Fellow',
        'Published 30+ research papers'
      ],
      patients: 3200,
      gender: 'female',
      online: true,
      location: 'New York, NY'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Neurology',
      specialtyId: 'neurology',
      experience: 12,
      rating: 4.8,
      reviews: 980,
      fee: 180,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
      availability: ['Tuesday', 'Thursday', 'Saturday'],
      timeSlots: ['10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '4:00 PM'],
      education: 'MD, Neurology - Johns Hopkins University',
      languages: ['English', 'Mandarin'],
      about: 'Renowned neurologist specializing in stroke treatment and neurological disorders. Advanced training in minimally invasive neurosurgery.',
      achievements: [
        'Neurology Excellence Award 2022',
        'Stroke Research Grant Recipient',
        'Teaching Excellence Award'
      ],
      patients: 2800,
      gender: 'male',
      online: false,
      location: 'Los Angeles, CA'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrics',
      specialtyId: 'pediatrics',
      experience: 10,
      rating: 4.9,
      reviews: 1560,
      fee: 120,
      image: 'data:image/jpeg;base64,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',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      timeSlots: ['9:00 AM', '10:30 AM', '1:00 PM', '3:00 PM'],
      education: 'MD, Pediatrics - Stanford University',
      languages: ['English', 'Spanish'],
      about: 'Compassionate pediatrician dedicated to children\'s health. Provides comprehensive care from infancy through adolescence with a gentle approach.',
      achievements: [
        'Pediatric Care Award 2023',
        'Community Service Recognition',
        'Child Health Advocate of the Year'
      ],
      patients: 4100,
      gender: 'female',
      online: true,
      location: 'Miami, FL'
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'General Medicine',
      specialtyId: 'general',
      experience: 20,
      rating: 4.7,
      reviews: 2100,
      fee: 100,
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      timeSlots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
      education: 'MD - Mayo Clinic',
      languages: ['English'],
      about: 'Experienced general physician providing primary care for the whole family. Focuses on preventive medicine and chronic disease management with personalized care plans.',
      achievements: [
        'Family Physician of the Year 2021',
        'Patient Choice Award',
        'Excellence in Primary Care'
      ],
      patients: 5200,
      gender: 'male',
      online: true,
      location: 'Chicago, IL'
    },
    {
      id: 5,
      name: 'Dr. Lisa Patel',
      specialty: 'Dentistry',
      specialtyId: 'dentistry',
      experience: 8,
      rating: 4.9,
      reviews: 890,
      fee: 130,
      image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      timeSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'],
      education: 'DDS - University of Michigan',
      languages: ['English', 'Hindi'],
      about: 'Skilled dentist providing comprehensive dental care including cosmetic dentistry, root canals, and routine cleanings. Known for gentle, pain-free procedures.',
      achievements: [
        'Top Dentist Award 2023',
        'Cosmetic Dentistry Certification',
        'Patient Satisfaction Excellence'
      ],
      patients: 1900,
      gender: 'female',
      online: false,
      location: 'Houston, TX'
    },
    {
      id: 6,
      name: 'Dr. Robert Taylor',
      specialty: 'Orthopedics',
      specialtyId: 'orthopedics',
      experience: 14,
      rating: 4.8,
      reviews: 1120,
      fee: 160,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
      availability: ['Monday', 'Wednesday', 'Friday'],
      timeSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
      education: 'MD, Orthopedics - UCLA Medical School',
      languages: ['English'],
      about: 'Sports medicine specialist and joint replacement expert. Has treated professional athletes and helped thousands recover from orthopedic injuries.',
      achievements: [
        'Sports Medicine Specialist Certification',
        'Joint Replacement Excellence Award',
        'Research Excellence Recognition'
      ],
      patients: 2600,
      gender: 'male',
      online: true,
      location: 'Denver, CO'
    },
    {
      id: 7,
      name: 'Dr. Maria Garcia',
      specialty: 'Dermatology',
      specialtyId: 'dermatology',
      experience: 11,
      rating: 4.9,
      reviews: 1340,
      fee: 140,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgQm3EMgKKbWt5LDVaXkrbmuYzyH6wAnr03A&s',
      availability: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      timeSlots: ['10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'],
      education: 'MD, Dermatology - NYU School of Medicine',
      languages: ['English', 'Spanish'],
      about: 'Board-certified dermatologist specializing in medical and cosmetic dermatology. Expert in skin cancer detection, acne treatment, and anti-aging procedures.',
      achievements: [
        'Dermatology Excellence Award 2022',
        'Cosmetic Dermatology Certification',
        'Skin Cancer Research Grant'
      ],
      patients: 2300,
      gender: 'female',
      online: true,
      location: 'Phoenix, AZ'
    },
    {
      id: 8,
      name: 'Dr. David Kim',
      specialty: 'Ophthalmology',
      specialtyId: 'ophthalmology',
      experience: 9,
      rating: 4.7,
      reviews: 780,
      fee: 145,
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      availability: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      timeSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'],
      education: 'MD, Ophthalmology - Columbia University',
      languages: ['English', 'Korean'],
      about: 'Comprehensive eye care specialist offering cataract surgery, LASIK, and treatment for glaucoma and macular degeneration. Advanced training in refractive surgery.',
      achievements: [
        'LASIK Surgery Certification',
        'Cataract Surgery Specialist',
        'Patient Choice Award'
      ],
      patients: 1700,
      gender: 'male',
      online: false,
      location: 'Seattle, WA'
    },
    {
      id: 9,
      name: 'Dr. Jennifer White',
      specialty: 'Gynecology',
      specialtyId: 'gynecology',
      experience: 13,
      rating: 4.9,
      reviews: 1670,
      fee: 155,
      image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMVFRUXFRMVGBIXEhUXFRUXFxcXFxcSGRYYHSggGBolHRcVITEhJSkrLi4uGB8zODMtOCgtLisBCgoKDg0OGxAQGC0lHyM1NysrLS0tLS0tMCstLS0uLi01Ky0tLS0tMC0tLi01LS0tLS0vLSsrLS83LS8rLS0tNf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABAUDBgcCAQj/xABFEAABAwEFBAcDCQYEBwAAAAABAAIRAwQFEiExQVFhkQYTIjJxgaEHscEjQlJicoKSwtEUorLh8PEzQ1OzCBUkJTVjg//EABkBAQADAQEAAAAAAAAAAAAAAAABAwQFAv/EAC0RAQACAgECBAQGAwEAAAAAAAABAgMRBCExEiJRcTNBYYEFEzKx0fAjofFD/9oADAMBAAIRAxEAPwDuKIiAiIgIiICIiAiIgIirukF9UrHQfXrGGtGm1ztjGjaSgsUlcCvP2i3hWf8AJuNPEexTZo0cXbStTq3/AGyu4uq16r88xjdH4RlCjb1p+qUX596P3/aqEOp1XDg4l9N3AtccvJdV6HdOKdsPVVAKVojuT2akammTt2lpzHEZpEk1021ERS8iIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgL87e0XpQ+8LYadIl1Gk406LRo9wMOrcZOQ4DiV2P2k30bJd1oqtMPLerYdz6nYDvKSfJcP8AZ5Yg6oX6lkAcCRJPuHNVZb+GF2GnjtptXRfoeWBr6zy52uEd1siFZHoDQALmFzHbwZHIrYLJoFNaclki1p67b5pWOmnI79slWyuwuGR0cB2Xj4HgqKleLmva4OLS0ghwMOY4GQZ4Lrl8U6FoY6k5zHTsDgXA7COIXF73sjqVRzD3mnPiPpBXY8kz0nuz5cfh6x2fpfobff7ZZKdYxjjBUA2VG5O8AcnDg4K7XEfYVfwbXqWVzsqjQ9g+uzUDiWz+BduWms7hjtGpERFKBERAREQEREBERAREQEREBERAREQEREBERBx3/iDvKG2Wzg5E1K7h9kBjJ4HE/kuc9D7YKdKs5xfGNoGB5acTgA0aZnhotp9vLS63tGsWekI3DHVJ96ofZu6i7r6NUAzgMESCBI2abFRknpMtGH9UQ2W6ek1SliD3VHhpY0teWY2OcS0AnI6tds3HOQra+rXVrF9PAQKYaSzFnUlodpuGJs6zK8XldzCxjKdPsmpTLn4YENIIaJ10HktktVmw1hWa0FxYGOGQxNmRnsIOmzUcRnm1d7iGyK2iNTLULpvC2YuqdQb1bSQQ1jWtIB7L2O26A6ArXOntCpVYy09WKYygE/KkHaQOzxHAiQDkurVCXNLRTLAdScIMbYwk89ioL+sYrxRAEOyjQbduxPzNW3EI/K3TUy4/c14us1opVgS1zHtcCNwOvnmI4r9b2SuHsa8aOAPNflbpXc4o1uqBktls5d5snZpkv0f0AtBqXbZHEyTQpyeIEH1C1452w5K6X6IisVCIiAiIgIiICIiAiIgIiICIiAiIgIiIC806gcJaQRvCrb0tWrRs70bTsYPEx7lNsNDBTa3aBn9o5uPMleYtudPc11XcuJe2mmP+Ys3mgyeHbcAueXWTRtrHAxLoz0MjIHzAW9e2ur/3ERso0x5kn+S57fYJc14yxNa4EbCNR5FeNbmYe96iJ9HY7fejDRaKoeGPiHMBOFw4t0zCkXfeFnaQ4urVHDLEWVDAjQjRaX0M6SNtDepqwHDVp0n6Q4H0K3ywXXTEODiRsBMj+SxzXwzqXUpelq7SnWkvEhrmg6BwgxvjYtF9pNtNNlGmx7mPfVacTXFrg1skkEZjYtuvi8m08h2nbGjX+y5p04Y7rqD35ktrO4T2AB6qcUefqpzT5J0rLxAlmfid7iSXHx1XfvZS8m66APzetb5dY8j0IX51tDjgaOAM7zr8Su7+xW8RUsPVznTe4EcHEvafA4iPula6T5mG/Z0FERWqRERAREQEREBERAREQEREBERAREQFCvWsWsEGJcBI10Jy5KaqPpY8hlKDrWH+3UPwXm86rL3jjdohGc4/3d6rALR1RD9CXGSSTnExO0EStS6fUrQerNMnCCHFrcnGD3Z3HJfHXw7qHGq0gsaNcpwk8nQRzWObS6MUjXVqPtZtTatvc5uxtIeeGT71o1sqTSDdrY5Sc/63BbNfFmrWquW0Kbqr4aHYR2WucS8y7RoGKMzsVhcPs3e60Np16jS4NDqrGAllJh7rS4995GgiBrmtuHFN5czLkisNS6I2Zxq4yCGluR0mTqOGS6BQtFecHWEDgpF8WJv7RUDGhrWFtNoGwMaB78R81MsFmkB0ZjI+IWPPaPHLocesxSGa77rky7M6knMqk6dXS6u0GnEsJiTEiJIHGQFt2I4IGpIHNYLxYGMM7Gqqm5tGlt9eGduOVKRnA4EZDDII0EOHjI9Cug+xS1mlbXUiYFWmcvrMMiN+RdzKta/RZte65iajHVKjDliDQTiaDxgmN8KiuXo9abNWs1qYOvotex/W0x2sB7Lw+nMgwXgxIy1XSyYJp5o9dT9JcqmaL7j7x7O+IvLHAgEaEA816RAiIgIiICIiAiIgIiICIiAiIgIiIC1zpqThoBveFbFHAU3g/wAQWxrV7+q465bsptAHi6HE8sPJVZp1Rdgru8Km318LRUfGWzWcwoFtsDbVgL8hiBNOILmgjC0+rjOwL5e1nxVKbTmNcO/X0yUypVFOkKzphrcZ39lpcR46heeNj8XWV3Ky+Hyw9Xzb6NjpYxga7D2KWQxEncNknM8FM6KXeadMue7FUqO6x79cTiNh3DQbNyouj9yipTNqtbMdSq0uGNuJrWkdkBp0bHvVt0DkWUNJnDVrMEGYDXkR4TPlC6l4rXHNaz8+v1/5/tyq+K2SLWj5dP7/AHTWrRRw2iq0f61SJ4uJ+Ku7ts+BpnPEZ8FUdKAW2urxLHDzY34gqyum2Y2DeMj4rH+IcbURmr2nv7tv4fydzOG3eO3skU6JMwPnSPABUF92xxfA0Gvir29bd1TMu87IcN7lq3fc1g1c5rfNxj4qz8L43/tb7fyr/E+T0/Jr9/4dHuOjgs9ERHybSRuJGIjmSqXoh8m602T/AEqpcwbqdTNo8sj95X1625tCi+qcwxsxv2BvmYC0+nZreHft4FJz3M7dnEtmmIIEz3oA8I2rRjjx1tNp1vt79/77suSfDauo3Md/bt+/7N6pVXN0J8NQplC2z3h5jTkqG5rzZaGCoyQCILT3mOBOJjhvCsaZzWW1ZidS0xMTG4XKKHddbEzPUZfp/XBTF4SIiICIiAiIgIiICIiAiIgIiIC0m2WjFaq+7G1v4WNB9QVurnAAk6DOVzK565qF1Q6ve+p4Y3F0eqzcmekQ18SPNMpNrk1mYdkzppuzU+22dr2ik9pLXVAXDTsd4kxsxEN81Es2dob9l3wVrbKPygftLerjgcTyf3RyVvGnyK+THnZLybFJwENGEsGXZEjCMtwkL1dFkbSosYwANAkAfWOLzOeu1ebRXb8m17mtxOHecBOHMATqScIjiVOgAQNBkBwV+1DQenbItIO+kw+Yc4fAKqu28OrfiOmhG8fqrz2h04fQfvbUbwyLT+YrVGnPOF18Na5MEVt2no5OW1seebV7wsrZb+seXHyG4LP0YpY7XSGwOLj91pI9YVW87Vsfs/oTWqP+iwN83mfc0r1liMeGYr2iNIpNsmWJt33ttt+WPrqFWl9JpA8RmPUBZLtc00WOAiWtnfMQQeMyFJjNRWkU3PadP8Rvg7vD8Un74XG3OtOtqN7Vt2WBtC1V8E4agbUInshwJkAbO96K3pv1KhPdhdTJ1cXNP3hi97QsrjrJ7IOfE7ApmZnuRER2S7oqw4D6Uj4j+uKvFrJcQWnQzIG6NFslN8gEbRK8yl6REXkEREBERAREQEREBERAREQUvTK2dVY6pBzc3q275qdiR4Ak+S0q4R2fRSfafeJNWjQHdYDWdxcZYweUP5hRrnMUwsPItu+vR0eLTVN+qXYnRamcQ4ehPwVnftoDHUSTHaJO6MLgZOwdoclRCpFemfrt9THxWwX9SD7NWaWB4NN/ZORmCR5gwtPF610z8uNW2oa9kdbHT2DTAwgvBPewnG0Ed4RkRv1C3IGVS3a8EAjQgEeBEhWbHFaJZlB7QKM0qTt1Qj8TSfyrRH0BsXQ+nQmxucPmvpu5nD+ZcyNodvXV4c7xuVy+mRMGQgrfOgVnig5/06h5NAHvxLm/WHeus9GaGCy0R9QOPi/tn3qObbWPXq9cON336LTaol605aHRmwz4t+cPcY3tCz4s1htdMHPuu+mMnDhO0cFynTQLfBYcx2RiB3RmDK9Wa0ggEwcRJA2+Kp7VZ3Na5vWHCZBbDYDT80SJA4TopFw2ao1gdUcJIHYBxAbRGzkvUQhZVnOe/LZl4K/uh804OoJHxWvGq45DIbYGZ8Sre5HEEg7RPL+6ieyVwiIvAIiICIiAiIgIiICIiAsNrrYGl0Ssyi3iRgM6SJSBoHTKxl/VVtezgceObgfOXclFu8w0BbTRYyvRNOd7Z1hzTkZVbYrnI/xCABsaZJ8xosmbDab7iO7oYM9Yx6t8kSx2A1Hh5HYafxO2N8Bqf5rYq1TE05jTXgRrK81GgNAaIGTQBx2D9fFeHUOvaKcQHkTvwCC7TTL3hasWOKRpky5JvbaFYTEAaDs/hMfBWzSqOg6Kjwd4I+8A73kq6omQrJVK7pAJsVoafmtPJsPb6RyXLHDKV1i+GYqNdv06FQeYa79fRchbVLeIK6XAnyzDm86PNEvdMY3NaBm5zWj7xj4rtkhrQNBkB4Bcf6N0Q+10BH+YHfgl/wCVdXrmXxsaOZOfuhV8+fNELODHSZe2vk8FhtNRfapVdeFVwjPI5TAyWHTchWyHYg4nCWkHOMiM1KuGmW2em0kkhjZ3zGai2uxF9N7QZL2uE7ACCrSy0YAaDpEZ5xsU/JHzSGvOgaVNu0OD2kiBpzCwsqOGRIPvUihVBc37TfeFCV4iIvAIiICIiAiIgIiICIiAvNRgIIO1ekQaDabA5loc0Ocwuk5EgOk6xoch6qdQqVG5VJeQYaQGgkfWy9Vs1usDKo7QzGjhk5vgfIKGy5z86pI4NgnxMletp2rrPSc87dwzJgHUg7zpO5XdhsuAEmJPoN3opFKi1ohohfLU6GOO5rj6KJlDR7VlWafpMHp/dW9lOSpr5ydSO4xzCtbIcl6Hu1NkeBz8CCD6FccazIsOrZb5gx8F2C22ljINRzWSQwYiAHEzDBxMHkuSdIrOadoq4To8uHEO7XuK3cCesww86OkStPZ9Tm2Z/wCXTe6fEhvuJXSW79pJPNaH7NyH1K7tIbSad/aL5/hW/VHgBV8yd5ZWcONYoYXlQrUzEC3fp4qW4qHU1WaGpGuysWPDX6Tr8Fa2NwdLW4XOYSNRIjITxiFF6oPVfTuSKtSqHQXlrp29loGRHmpQ2NtkOrz5Bfa7mtiBnI9DKj0Kr4DRLiPnHIfzXqrZ3RJdmcgAIaOJnM+ijSW1IvNLQeAXpVgiIgIiICIiAiIgIiICIiAiIgKLejopP+yRzy+KlKtv+pFKPpOYORxe5pSBqnSBvyYO5zT6qdYHZA8FEv8AHyL/ALM8s1Iu0ywHgFYJdsslOq3DUaHCQ6CJzbmDwI3rmfTFoba6oGkUzlp/htHwXTg/Ncs6ePw25+WRZTMfdj4LVwvifZj5vw/uvPZzZ4p1ngSXVms8mtBn98rcHshUfs6bFjDj86rUPIhv5VsFTNVcid5bLuPGsVWEhV9d+cKwdoq2zMklx2lVLWazkhR6lori0hopsqUTSDsyWua/E4GDtEBuSlbVnpUyajHAiAyoCDtM08PLt80GWz2obaZZxOnMLM6k09ovBA3aD1XplKdQ2fCV5tFAkHPwGgHHiiWx0e63wHuXtRrudLBwy/T0hSVWCIiAiIgIiICIiAiIgIiICIiAte6RVpq0mbBLidmYIH9cVsK1O02jFa6o1AFMRzBPMKYEe9GSxw3g+5Y+j7ppM8I5ZKxtIBByVT0fyaQNjnD1XsW9RnJcv9oFE/thIz+Sp/mXUesGhXMfaG8fthz/AMqnwOrlq4XxGTm/D+7b+hVEtsNEHb1jvxVHn4hXag9H6RbZLOP/AE0zzaCfepbnLPknd5n6tGONUiPoxWg5FYaTYAA2BZarC7u+9ZKNmgZkc15e0V2qnWUZgkxkRBjM6j3HmsbWNB3qm6W0DUs7htAxDhqD+6XDzSTTbWr5VGRXOrtokNGGpVb9mtUHoDCkXTaK9W20aBtFbq3GpiGIAw2m93eidQFkryqzOtNVuLasb26Rc7hhcBsI5wrBR7FZG024Wyd7nGXHiSpCvZRERAREQEREBERAREQEREBERAWk0nYrQ6oNCHci6R/XFbVe9XDReZiW4QeLuyDzK1K6MzP1WjzXqosKzoVRdLoqVG/WkeatKzwMnaHbuVSwYbSIOTgRyXolOvp9p6sfsopmrjZnUDi3BPbHZzmFz72m0GutUuEO6hmW3vVNq6e0cYXNOnbA630296WUWz41Hj4rTw+mT7MnM+H09XQbOC1rKQB7NNucE5NAbE7+C9OWarWjJRKhJWX5tbNQG1ei9YWMB3j4r04AKR9Gqi16eMOb9IEehWcnVfKTYE8CUGq3KZpN8Ap/Q6jivIZdylVf5nCz8xUG5mwzDuVt0Azt1U7qBH77f0XJx1/y6dXLb/DMuioiLpOUIiICIiAiIgIiICIiAiIgIiIKTpXU+Sa36T2+mf6KluoZnw9xKsOlzs6Y3OB5h36Kqucxj3FxI5mf18yvcdhYuA0O1U9uZhqU3jQPw88lZVXTMqrcJpa5jb4Fehdgg5Fc76Vtm9qDY22Xl1hPuXQKLgQDEyAufX5Rm/rPAiBTMTl2W1HfBXYJ1aZ+kqM9fFWI+sOg1BmvBEL28lY6uizwvfBUdHZaPExksVIuJkrLTzEbPevTjCkYnycktLoYc8yInx2rww5SfFRbxqEsO8gwPQD1TtHU7qW5c6ZO8fBXfQJn/V1DvouHJ7P1VfQsmCkGjYrX2dUvlbQ4nMNpgfeLif4Wrl0nxZtw6eSPDg1Po3tERdBzBERAREQEREBERAREQEREBERBrHSnvjxH8L1WXV3fMoisgSa23wVb8x3iURShbXd3W/ZHuWi3h/52j9kf7VREVuHvb2lVm7R7w3e0d7yWNyIqFz1R0Xmp3XfZ+CIpGN/c5KHbtWIi8Zf0S94/1x7vNXu81ZezrW0f/L86+Iudg+JDo8j4Ut1REXQcsREQEREBERB//9k=',
      availability: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      timeSlots: ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM'],
      education: 'MD, OB/GYN - Johns Hopkins University',
      languages: ['English'],
      about: 'Women\'s health specialist providing prenatal care, family planning, and gynecological surgery. Compassionate care for women of all ages.',
      achievements: [
        'Women\'s Health Advocate Award',
        'Minimally Invasive Surgery Expert',
        'Patient Compassion Recognition'
      ],
      patients: 2900,
      gender: 'female',
      online: true,
      location: 'Boston, MA'
    },
    {
      id: 10,
      name: 'Dr. William Brown',
      specialty: 'Psychiatry',
      specialtyId: 'psychiatry',
      experience: 16,
      rating: 4.8,
      reviews: 890,
      fee: 170,
      image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=400&fit=crop',
      availability: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
      timeSlots: ['10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'],
      education: 'MD, Psychiatry - Yale University',
      languages: ['English'],
      about: 'Compassionate psychiatrist providing treatment for depression, anxiety, bipolar disorder, and other mental health conditions. Evidence-based approaches.',
      achievements: [
        'Mental Health Excellence Award',
        'Cognitive Behavioral Therapy Expert',
        'Research Publication Award'
      ],
      patients: 1500,
      gender: 'male',
      online: true,
      location: 'Portland, OR'
    },
    {
      id: 11,
      name: 'Dr. Patricia Martinez',
      specialty: 'Pediatrics',
      specialtyId: 'pediatrics',
      experience: 7,
      rating: 4.8,
      reviews: 720,
      fee: 115,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGJxNNfmubK3-eCvOWZhxpZ2JukBxF-IhBg&s',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
      timeSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'],
      education: 'MD, Pediatrics - University of Texas',
      languages: ['English', 'Spanish'],
      about: 'Dedicated pediatrician passionate about child health and development. Specializes in vaccinations, growth monitoring, and childhood illness treatment.',
      achievements: [
        'Child Health Advocate',
        'Vaccination Excellence Award',
        'Community Service Recognition'
      ],
      patients: 1800,
      gender: 'female',
      online: true,
      location: 'Austin, TX'
    },
    {
      id: 12,
      name: 'Dr. Thomas Anderson',
      specialty: 'Cardiology',
      specialtyId: 'cardiology',
      experience: 18,
      rating: 4.9,
      reviews: 1450,
      fee: 165,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
      availability: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      timeSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'],
      education: 'MD, Cardiology - Duke University',
      languages: ['English'],
      about: 'Interventional cardiologist specializing in heart catheterization and stent placement. Performed over 5000 successful procedures.',
      achievements: [
        'Interventional Cardiology Expert',
        'Heart Health Advocate',
        'Teaching Excellence Award'
      ],
      patients: 3800,
      gender: 'male',
      online: false,
      location: 'Atlanta, GA'
    }
  ];

  const specialties = [
    { id: 'all', name: 'All Specialties', icon: '👨‍⚕️', count: doctors.length },
    { id: 'cardiology', name: 'Cardiology', icon: '❤️', count: doctors.filter(d => d.specialtyId === 'cardiology').length },
    { id: 'neurology', name: 'Neurology', icon: '🧠', count: doctors.filter(d => d.specialtyId === 'neurology').length },
    { id: 'pediatrics', name: 'Pediatrics', icon: '👶', count: doctors.filter(d => d.specialtyId === 'pediatrics').length },
    { id: 'dentistry', name: 'Dentistry', icon: '🦷', count: doctors.filter(d => d.specialtyId === 'dentistry').length },
    { id: 'orthopedics', name: 'Orthopedics', icon: '🦴', count: doctors.filter(d => d.specialtyId === 'orthopedics').length },
    { id: 'dermatology', name: 'Dermatology', icon: '🧴', count: doctors.filter(d => d.specialtyId === 'dermatology').length },
    { id: 'ophthalmology', name: 'Ophthalmology', icon: '👁️', count: doctors.filter(d => d.specialtyId === 'ophthalmology').length },
    { id: 'gynecology', name: 'Gynecology', icon: '👩', count: doctors.filter(d => d.specialtyId === 'gynecology').length },
    { id: 'psychiatry', name: 'Psychiatry', icon: '🧠', count: doctors.filter(d => d.specialtyId === 'psychiatry').length }
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialtyId === selectedSpecialty;
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = doctor.rating >= filters.minRating;
    const matchesFee = doctor.fee <= filters.maxFee;
    const matchesExperience = filters.experience === 'all' || 
      (filters.experience === '0-5' && doctor.experience <= 5) ||
      (filters.experience === '6-10' && doctor.experience >= 6 && doctor.experience <= 10) ||
      (filters.experience === '11-15' && doctor.experience >= 11 && doctor.experience <= 15) ||
      (filters.experience === '15+' && doctor.experience > 15);
    const matchesGender = filters.gender === 'all' || doctor.gender === filters.gender;
    
    return matchesSpecialty && matchesSearch && matchesRating && matchesFee && matchesExperience && matchesGender;
  });

  const handleBookAppointment = (doctor) => {
    if (!user) {
      toast.error('Please login to book an appointment');
      return;
    }
    toast.success(`Booking appointment with ${doctor.name}`);
  };

  const getStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < fullStars; i++) stars.push('★');
    if (hasHalfStar) stars.push('½');
    while (stars.length < 5) stars.push('☆');
    return stars.join('');
  };

  return (
    <>
      <Helmet>
        <title>Our Expert Doctors - MediBook | Top Medical Professionals</title>
        <meta name="description" content="Meet our team of highly qualified doctors specializing in various medical fields. Book appointments with top-rated physicians." />
      </Helmet>

      <div className="doctors-page">
        {/* Hero Section */}
        <section className="doctors-hero">
          <div className="hero-overlay"></div>
          <div className="hero-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-content"
            >
              <h1>Our Expert Doctors</h1>
              <p>Meet our team of highly qualified medical professionals</p>
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="stat-number">{doctors.length}+</span>
                  <span className="stat-label">Expert Doctors</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-number">{(doctors.reduce((acc, d) => acc + d.rating, 0) / doctors.length).toFixed(1)}</span>
                  <span className="stat-label">Average Rating</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-number">{doctors.reduce((acc, d) => acc + d.patients, 0).toLocaleString()}+</span>
                  <span className="stat-label">Happy Patients</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search and Filters */}
        <div className="doctors-controls">
          <div className="controls-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by name, specialty, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="view-toggle">
              <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>Grid View</button>
              <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>List View</button>
            </div>
            <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? 'Hide Filters ▲' : 'Show Filters ▼'}
            </button>
          </div>
        </div>

        {/* Specialties Navigation */}
        <div className="specialties-section">
          <div className="specialties-scroll">
            {specialties.map(specialty => (
              <button
                key={specialty.id}
                className={`specialty-chip ${selectedSpecialty === specialty.id ? 'active' : ''}`}
                onClick={() => setSelectedSpecialty(specialty.id)}
              >
                <span className="specialty-icon">{specialty.icon}</span>
                <span className="specialty-name">{specialty.name}</span>
                <span className="specialty-count">{specialty.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="doctors-container">
          {filteredDoctors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No Doctors Found</h3>
              <p>No doctors match your search criteria. Please try different filters.</p>
            </div>
          ) : (
            <div className={`doctors-${viewMode}`}>
              {filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  className={`doctor-card-${viewMode}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={viewMode === 'grid' ? { y: -8 } : { x: 5 }}
                >
                  <div className="doctor-image">
                    <img src={doctor.image} alt={doctor.name} />
                    {doctor.online && <div className="online-badge">● Online</div>}
                  </div>
                  <div className="doctor-info">
                    <h3>{doctor.name}</h3>
                    <p className="specialty">{doctor.specialty}</p>
                    <div className="rating">
                      <span className="stars">{getStars(doctor.rating)}</span>
                      <span className="rating-value">{doctor.rating}</span>
                      <span className="reviews-count">({doctor.reviews} reviews)</span>
                    </div>
                    <div className="doctor-details">
                      <span>📅 {doctor.experience}+ years</span>
                      <span>💰 ${doctor.fee}/visit</span>
                      <span>👥 {doctor.patients.toLocaleString()}+ patients</span>
                    </div>
                    <div className="availability">
                      <strong>Available:</strong> {doctor.availability.slice(0, 3).join(', ')}
                    </div>
                    <div className="languages">
                      <strong>Languages:</strong> {doctor.languages.join(', ')}
                    </div>
                    <div className="location">
                      📍 {doctor.location}
                    </div>
                    <div className="doctor-actions">
                      <button className="view-profile-btn" onClick={() => setSelectedDoctor(doctor)}>View Profile</button>
                      <button className="book-btn" onClick={() => handleBookAppointment(doctor)}>Book Appointment</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Doctor Profile Modal */}
        <AnimatePresence>
          {selectedDoctor && (
            <motion.div className="doctor-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedDoctor(null)}>
              <motion.div className="modal-content" initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedDoctor(null)}>✕</button>
                <div className="modal-header">
                  <img src={selectedDoctor.image} alt={selectedDoctor.name} className="modal-image" />
                  <div className="modal-title">
                    <h2>{selectedDoctor.name}</h2>
                    <p className="modal-specialty">{selectedDoctor.specialty}</p>
                    <div className="rating">
                      <span className="stars">{getStars(selectedDoctor.rating)}</span>
                      <span>({selectedDoctor.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="modal-body">
                  <div className="info-section"><h3>About Doctor</h3><p>{selectedDoctor.about}</p></div>
                  <div className="info-section"><h3>Education</h3><p>{selectedDoctor.education}</p></div>
                  <div className="info-section"><h3>Achievements</h3><ul>{selectedDoctor.achievements.map((a, i) => <li key={i}>🏆 {a}</li>)}</ul></div>
                  <div className="info-grid">
                    <div><strong>Experience</strong><p>{selectedDoctor.experience}+ years</p></div>
                    <div><strong>Consultation Fee</strong><p>${selectedDoctor.fee}</p></div>
                    <div><strong>Languages</strong><p>{selectedDoctor.languages.join(', ')}</p></div>
                    <div><strong>Location</strong><p>{selectedDoctor.location}</p></div>
                  </div>
                  <div className="info-section"><h3>Available Time Slots</h3><div className="time-slots">{selectedDoctor.timeSlots.map((slot, i) => <span key={i} className="time-slot">{slot}</span>)}</div></div>
                </div>
                <div className="modal-footer"><button className="book-appointment-btn" onClick={() => { handleBookAppointment(selectedDoctor); setSelectedDoctor(null); }}>Book Appointment</button></div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-container"><h2>Need Help Choosing a Doctor?</h2><p>Our team can help you find the right specialist for your needs</p><button className="cta-btn">Contact Medical Concierge</button></div>
        </section>
      </div>

      <style>{`
        .doctors-page { min-height: 100vh; background: #f7fafc; }
        .doctors-hero { position: relative; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 4rem 2rem; text-align: center; }
        .hero-container { position: relative; max-width: 1200px; margin: 0 auto; }
        .hero-content h1 { font-size: 3rem; color: white; margin-bottom: 1rem; }
        .hero-content p { font-size: 1.2rem; color: rgba(255,255,255,0.9); margin-bottom: 2rem; }
        .hero-stats { display: flex; justify-content: center; gap: 3rem; }
        .hero-stat { background: rgba(255,255,255,0.1); padding: 1rem 2rem; border-radius: 12px; }
        .stat-number { display: block; font-size: 2rem; font-weight: bold; }
        .doctors-controls { background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 70px; z-index: 100; }
        .controls-container { max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
        .search-bar { flex: 1; }
        .search-bar input { width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem; }
        .view-toggle { display: flex; gap: 0; }
        .view-toggle button { padding: 0.5rem 1rem; border: 2px solid #e2e8f0; background: white; cursor: pointer; }
        .view-toggle button:first-child { border-radius: 8px 0 0 8px; }
        .view-toggle button:last-child { border-radius: 0 8px 8px 0; }
        .view-toggle button.active { background: #667eea; color: white; border-color: #667eea; }
        .filter-toggle { padding: 0.5rem 1rem; background: #f7fafc; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; }
        .specialties-section { background: white; border-bottom: 1px solid #e2e8f0; overflow-x: auto; }
        .specialties-scroll { max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; display: flex; gap: 1rem; }
        .specialty-chip { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #f7fafc; border: 2px solid #e2e8f0; border-radius: 40px; cursor: pointer; white-space: nowrap; transition: all 0.3s; }
        .specialty-chip.active { background: #667eea; border-color: #667eea; color: white; }
        .doctors-container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .doctors-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; }
        .doctor-card-grid { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.3s; }
        .doctor-image { position: relative; height: 280px; overflow: hidden; }
        .doctor-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .doctor-card-grid:hover .doctor-image img { transform: scale(1.05); }
        .online-badge { position: absolute; bottom: 10px; right: 10px; background: #48bb78; color: white; padding: 0.25rem 0.5rem; border-radius: 20px; font-size: 0.75rem; }
        .doctor-info { padding: 1.5rem; }
        .doctor-info h3 { font-size: 1.2rem; margin-bottom: 0.25rem; }
        .specialty { color: #667eea; font-weight: 600; margin-bottom: 0.5rem; }
        .rating { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
        .stars { color: #fbbf24; }
        .doctor-details { display: flex; gap: 1rem; margin-bottom: 0.5rem; font-size: 0.8rem; color: #718096; flex-wrap: wrap; }
        .availability, .languages, .location { font-size: 0.8rem; margin-bottom: 0.5rem; color: #718096; }
        .doctor-actions { display: flex; gap: 1rem; margin-top: 1rem; }
        .view-profile-btn, .book-btn { flex: 1; padding: 0.5rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s; }
        .view-profile-btn { background: #f7fafc; border: 1px solid #e2e8f0; }
        .book-btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .view-profile-btn:hover, .book-btn:hover { transform: translateY(-2px); }
        .doctor-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .modal-content { background: white; border-radius: 20px; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative; }
        .modal-close { position: absolute; top: 1rem; right: 1rem; width: 32px; height: 32px; border-radius: 50%; background: white; border: none; cursor: pointer; z-index: 1; }
        .modal-header { display: flex; gap: 1.5rem; padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .modal-image { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid white; }
        .modal-body { padding: 2rem; }
        .info-section { margin-bottom: 1.5rem; }
        .info-section h3 { margin-bottom: 0.5rem; color: #2d3748; }
        .info-section ul { list-style: none; padding-left: 0; }
        .info-section li { margin-bottom: 0.5rem; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
        .info-grid div strong { display: block; font-size: 0.75rem; color: #718096; }
        .time-slots { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .time-slot { padding: 0.25rem 0.75rem; background: #f7fafc; border-radius: 20px; font-size: 0.8rem; }
        .modal-footer { padding: 1.5rem 2rem; border-top: 1px solid #e2e8f0; }
        .book-appointment-btn { width: 100%; padding: 1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; }
        .cta-section { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 4rem 2rem; text-align: center; color: white; }
        .cta-btn { margin-top: 1rem; padding: 0.75rem 1.5rem; background: white; color: #667eea; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .empty-state { text-align: center; padding: 4rem; background: white; border-radius: 20px; }
        @media (max-width: 768px) { .doctors-grid { grid-template-columns: 1fr; } .hero-content h1 { font-size: 2rem; } .hero-stats { flex-direction: column; gap: 1rem; } .modal-header { flex-direction: column; text-align: center; } .info-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
};

export default Doctors;