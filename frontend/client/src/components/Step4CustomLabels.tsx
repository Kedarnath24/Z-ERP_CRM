import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Sparkles, Loader2, Info, Wand2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Industry-specific label mappings
const LABEL_SUGGESTIONS = {
  'HR / People & Org': {
    eventTypeDefault: 'Sessions',
    eventTypeSuggestions: ['Interviews', 'Training Sessions', 'Meetings'],
    teamMemberDefault: 'Team Members',
    teamMemberSuggestions: ['Recruiters', 'HR Managers', 'Trainers'],
  },
  'Sales': {
    eventTypeDefault: 'Appointments',
    eventTypeSuggestions: ['Demos', 'Consultations', 'Pitches'],
    teamMemberDefault: 'Team Members',
    teamMemberSuggestions: ['Sales Reps', 'Account Managers'],
  },
  'Marketing': {
    eventTypeDefault: 'Events',
    eventTypeSuggestions: ['Campaigns', 'Strategy Meetings', 'Workshops'],
    teamMemberDefault: 'Team Members',
    teamMemberSuggestions: ['Marketers', 'Designers', 'Strategists'],
  },
  'Customer Support': {
    eventTypeDefault: 'Service Calls',
    eventTypeSuggestions: ['Support Sessions', 'Follow-ups', 'Ticket Reviews'],
    teamMemberDefault: 'Team Members',
    teamMemberSuggestions: ['Support Agents', 'Technicians'],
  },
  'Information Technology (IT)': {
    eventTypeDefault: 'Services',
    eventTypeSuggestions: ['Audits', 'System Checks', 'Installations'],
    teamMemberDefault: 'Team Members',
    teamMemberSuggestions: ['Engineers', 'Technicians', 'IT Consultants'],
  },
  'Healthcare': {
    eventTypeDefault: 'Consultations',
    eventTypeSuggestions: ['Check-ups', 'Appointments', 'Follow-ups'],
    teamMemberDefault: 'Team Members',
    teamMemberSuggestions: ['Doctors', 'Nurses', 'Practitioners'],
  },
  'Education / Training': {
    eventTypeDefault: 'Classes',
    eventTypeSuggestions: ['Courses', 'Tutorials', 'Workshops'],
    teamMemberDefault: 'Team Members',
    teamMemberSuggestions: ['Teachers', 'Instructors', 'Tutors'],
  },
  'Finance / Accounting': {
    eventTypeDefault: 'Consultations',
    eventTypeSuggestions: ['Reviews', 'Audits', 'Advisory Sessions'],
    teamMemberDefault: 'Team Members',
    teamMemberSuggestions: ['Accountants', 'Financial Advisors'],
  },
  'Real Estate': {
    eventTypeDefault: 'Viewings',
    eventTypeSuggestions: ['Inspections', 'Appointments', 'Consultations'],
    teamMemberDefault: 'Team Members',
    teamMemberSuggestions: ['Agents', 'Property Managers'],
  },
  'Travel / Hospitality': {
    eventTypeDefault: 'Bookings',
    eventTypeSuggestions: ['Reservations', 'Tours', 'Consultations'],
    teamMemberDefault: 'Team Members',
    teamMemberSuggestions: ['Travel Agents', 'Coordinators'],
  },
  'Consulting / Professional Services': {
    eventTypeDefault: 'Sessions',
    eventTypeSuggestions: ['Strategy Calls', 'Workshops', 'Reviews'],
    teamMemberDefault: 'Team Members',
    teamMemberSuggestions: ['Consultants', 'Analysts'],
  },
  'Salons & Spa / Personal Care': {
    eventTypeDefault: 'Appointments',
    eventTypeSuggestions: ['Treatments', 'Bookings', 'Sessions'],
    teamMemberDefault: 'Team Members',
    teamMemberSuggestions: ['Stylists', 'Therapists', 'Beauticians'],
  },
  'Fitness / Wellness': {
    eventTypeDefault: 'Sessions',
    eventTypeSuggestions: ['Workouts', 'Assessments', 'Classes'],
    teamMemberDefault: 'Team Members',
    teamMemberSuggestions: ['Trainers', 'Instructors', 'Coaches'],
  },
  'Others': {
    eventTypeDefault: 'Events',
    eventTypeSuggestions: ['Meetings', 'Sessions', 'Custom Type'],
    teamMemberDefault: 'Team Members',
    teamMemberSuggestions: ['Staff', 'Members'],
  },
};

export default function Step4CustomLabels() {
  const { data, updateData, prevStep } = useOnboarding();
  const [eventTypeLabel, setEventTypeLabel] = useState('');
  const [teamMemberLabel, setTeamMemberLabel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Get the selected industry from previous step
  const selectedIndustry = data.industries?.[0] || 'Others';
  const suggestions = LABEL_SUGGESTIONS[selectedIndustry as keyof typeof LABEL_SUGGESTIONS] || LABEL_SUGGESTIONS['Others'];

  const handleCreate = async () => {
    updateData({ eventTypeLabel, teamMemberLabel });
    
    const finalData = {
      ...data,
      eventTypeLabel,
      teamMemberLabel,
    };

    setIsSubmitting(true);

    try {
  const res = await apiRequest('POST', '/api/onboarding', finalData);
  const created = await res.json().catch(() => ({} as any));

      // Persist minimal company profile for the dashboard
      const companyProfile = {
        name: finalData.businessName || 'Your Company',
        businessName: finalData.businessName || 'Your Company',
        industry: finalData.industries?.[0] || 'General',
        eventTypeLabel: finalData.eventTypeLabel,
        teamMemberLabel: finalData.teamMemberLabel,
        availableDays: finalData.availableDays,
        availableTimeStart: finalData.availableTimeStart,
        availableTimeEnd: finalData.availableTimeEnd,
        currency: finalData.currency || 'INR',
        logo: finalData.businessLogo || '',
        location: finalData.location || '',
        description: finalData.description || '',
        website: finalData.websiteUrl || '',
        timezone: finalData.timezone || 'Asia/Kolkata',
  id: created?.id || undefined,
      };
      try {
        localStorage.setItem('zervos_company', JSON.stringify(companyProfile));
        
        // Save comprehensive organization data for booking page and profile
        const orgProfile = {
          businessName: finalData.businessName || 'Your Company',
          name: finalData.businessName || 'Your Company',
          logo: finalData.businessLogo || '',
          tagline: finalData.description || '',
          description: finalData.description || '',
          email: '',
          phone: '',
          website: finalData.websiteUrl || '',
          address: finalData.location || '',
          location: finalData.location || '',
          timezone: finalData.timezone || 'Asia/Kolkata',
          currency: finalData.currency || 'INR',
          industry: finalData.industries?.[0] || 'General',
          workingHours: `${finalData.availableTimeStart || '09:00 am'} - ${finalData.availableTimeEnd || '06:00 pm'}`,
          availableDays: finalData.availableDays || [],
          rating: 4.9,
          reviewCount: 0,
        };
        localStorage.setItem('zervos_organization', JSON.stringify(orgProfile));
        
        // Also save to booking page settings for public booking
        const bookingPageSettings = {
          businessName: finalData.businessName || 'Your Company',
          logo: finalData.businessLogo || '',
          tagline: finalData.description || '',
          welcomeMessage: `Welcome to ${finalData.businessName || 'our business'}! Book your appointment with us.`,
          backgroundColor: '#7C3AED',
          textColor: '#FFFFFF',
          buttonColor: '#FFFFFF',
          showLogo: true,
          metaTitle: `Book Appointment | ${finalData.businessName || 'Business'}`,
          metaDescription: `Schedule your appointment at ${finalData.businessName || 'our business'}`,
          metaKeywords: 'booking, appointment',
          website: finalData.websiteUrl || '',
          address: finalData.location || '',
          workingHours: `${finalData.availableTimeStart || '09:00 am'} - ${finalData.availableTimeEnd || '06:00 pm'}`,
          rating: 4.9,
          reviewCount: 0,
        };
        localStorage.setItem('zervos_booking_page', JSON.stringify(bookingPageSettings));
      } catch {}

      toast({
        title: 'Success!',
        description: 'Your account has been created successfully.',
      });

  // Redirect to dashboard
  setLocation('/dashboard');
    } catch (error) {
      console.error('Error creating onboarding:', error);
      toast({
        title: 'Error',
        description: 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    updateData({ eventTypeLabel, teamMemberLabel });
    prevStep();
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <motion.div
            className="absolute -top-4 -right-4"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Wand2 className="w-10 h-10 text-gray-300" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 tracking-tight flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Custom Labels 
            <motion.div
              animate={{
                rotate: [0, 15, 0, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-6 h-6 text-gray-700" />
            </motion.div>
          </motion.h1>
          
          <motion.p 
            className="text-gray-600 mt-2 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Customize how you refer to your team members
          </motion.p>
          
          <motion.div 
            className="h-1 w-24 bg-gradient-to-r from-gray-900 to-gray-600 rounded-full mt-3"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </motion.div>

        <div className="space-y-4 pt-8">
          <div className="space-y-2">
            <Label htmlFor="teamMember" className="text-sm font-semibold text-gray-900">
              How would you like to label your Team Members? <span className="text-red-600">*</span>
            </Label>
            <Input
              id="teamMember"
              placeholder="e.g., Team Members, Stylists, Therapists"
              value={teamMemberLabel}
              onChange={(e) => setTeamMemberLabel(e.target.value)}
              data-testid="input-team-member-label"
              className="h-12 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
            />
          </div>
        </div>
      </div>

      <motion.div 
        className="flex justify-between pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            onClick={handleBack}
            data-testid="button-back"
            className="min-w-36 h-12 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-semibold rounded-xl transition-all duration-300"
          >
            Back
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleCreate}
            disabled={!teamMemberLabel.trim() || isSubmitting}
            data-testid="button-create"
            className="min-w-36 h-12 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
          >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Create'
          )}
        </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
