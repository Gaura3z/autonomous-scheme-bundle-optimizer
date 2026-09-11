/**
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 * Demonstration Adaptive Questions Bank
 * Only questions triggered by remaining active candidate rules are rendered.
 */
import { Question } from '../types/assessment';

export const DEMO_QUESTIONS: Question[] = [
  {
    id: 'q_enrolled_higher_ed',
    field: 'studentStatus',
    label: 'Are you currently enrolled in a college or higher-education institution?',
    hint: 'Regular undergraduate, diploma, or post-graduate degree programs recognized by UGC, AICTE, or State Universities.',
    type: 'boolean',
    reason: 'Higher-education scholarships and fee waivers require active enrollment verification from an accredited college.',
    relevantWhen: 'Remaining candidate schemes include Post-Matric Scholarship or State Higher Ed Merit Stipend.'
  },
  {
    id: 'q_woman_enterprise',
    field: 'isWomanEntrepreneur',
    label: 'Are you a woman founder establishing or scaling a business enterprise?',
    hint: 'Applies to greenfield manufacturing, services, or trading enterprises where a woman holds at least 51% stake.',
    type: 'boolean',
    reason: 'Stand-Up India mandates priority credit access for women-led and SC/ST-led greenfield ventures.',
    relevantWhen: 'Remaining candidate schemes include Stand-Up India Bank Loans.'
  },
  {
    id: 'q_street_vendor',
    field: 'hasStreetVendingActivity',
    label: 'Do you operate an informal street vending stall, pushcart, or micro-retail service?',
    hint: 'Covers fruit/vegetable sellers, tea stalls, shoe repairers, artisan kiosks, and local market vendors.',
    type: 'boolean',
    reason: 'PM SVANidhi is earmarked exclusively for surveyed or verified street vendor working capital loans.',
    relevantWhen: 'Remaining candidate schemes include PM SVANidhi.'
  },
  {
    id: 'q_farmer_land',
    field: 'farmer',
    label: 'Do you own or cultivate agricultural land?',
    hint: 'Agricultural plots with land registry titles (such as 7/12 RoR, Khatian, or Patta).',
    type: 'boolean',
    reason: 'PM-KISAN and PM Fasal Bima Yojana require registered cultivable landholding records.',
    relevantWhen: 'Remaining candidate schemes include PM-KISAN, PMFBY, and Kisan Credit Card.'
  },
  {
    id: 'q_landholding_size',
    field: 'landholding',
    label: 'What is your total cultivable landholding size?',
    hint: 'Enter your operational land parcel size in hectares (1 hectare ≈ 2.47 acres).',
    type: 'number',
    min: 0.1,
    max: 25,
    step: 0.1,
    unit: 'Hectares',
    reason: 'Determines small & marginal farmer categorization and crop insurance coverage limits.',
    relevantWhen: 'Citizen confirmed active farming activity.'
  },
  {
    id: 'q_girl_child',
    field: 'hasGirlChildUnder10',
    label: 'Do you have a biological or adopted daughter below 10 years of age?',
    hint: 'Eligible for opening a sovereign high-yield savings account (Sukanya Samriddhi Yojana).',
    type: 'boolean',
    reason: 'SSY sovereign accounts can only be opened for a girl child prior to attaining 10 years of age.',
    relevantWhen: 'Remaining candidate schemes include Sukanya Samriddhi Yojana.'
  }
];
