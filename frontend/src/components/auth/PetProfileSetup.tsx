import React, { useState, useCallback } from 'react';
import { 
  PawPrint, Dog, Cat, Bird, Fish, Heart, 
  Upload, Info, ChevronRight, Camera, 
  AlertCircle, Check, Loader2, Share2
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

interface PetProfile {
  photo: string | null;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'fish' | 'other' | null;
  breed: string;
  age: string;
  ageUnit: 'years' | 'months';
  weight: string;
  weightUnit: 'kg' | 'lb';
  activityLevel: 'low' | 'medium' | 'high' | null;
  healthConditions: string[];
  dietaryPreferences: string[];
  notes: string;
}

const PetProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [profile, setProfile] = useState<PetProfile>({
    photo: null,
    name: '',
    species: null,
    breed: '',
    age: '',
    ageUnit: 'years',
    weight: '',
    weightUnit: 'kg',
    activityLevel: null,
    healthConditions: [],
    dietaryPreferences: [],
    notes: ''
  });

  const healthConditionOptions = [
    'Allergies',
    'Arthritis',
    'Dental Issues',
    'Diabetes',
    'Heart Condition',
    'Kidney Disease',
    'Obesity',
    'Skin Conditions'
  ];

  const dietaryOptions = [
    'Dry Food',
    'Wet Food',
    'Raw Diet',
    'Home Cooked',
    'Grain Free',
    'Prescription Diet'
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpeciesSelect = (species: PetProfile['species']) => {
    setProfile(prev => ({ ...prev, species }));
  };

const navigate = useNavigate();

  const handleHealthConditionToggle = (condition: string) => {
    setProfile(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(condition)
        ? prev.healthConditions.filter(c => c !== condition)
        : [...prev.healthConditions, condition]
    }));
  };

  const handleDietaryPreferenceToggle = (preference: string) => {
    setProfile(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter(p => p !== preference)
        : [...prev.dietaryPreferences, preference]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const {
      photo, name, species, breed, age, ageUnit,
      weight, weightUnit, activityLevel,
      healthConditions, dietaryPreferences, notes
    } = profile;
  
    const { data: { user }, error: userError } = await supabase.auth.getUser();
  
    if (userError || !user) {
      alert("User not logged in.");
      setIsSubmitting(false);
      return;
    }
  
    const { error } = await supabase.from('PetsDetails').insert({
      user_id: user.id,
      photo,
      name,
      species,
      breed,
      age,
      age_unit: ageUnit,
      weight,
      weight_unit: weightUnit,
      activity_level: activityLevel,
      health_conditions: healthConditions.join(", "),
      dietary_preferences: dietaryPreferences.join(", "),
      notes
    });
  
    if (error) {
      alert("Error saving pet profile: " + error.message);
    } else {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  
    setIsSubmitting(false);
  };
  

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Photo Upload */}
      <div className="text-center">
        <div className="relative inline-block">
          <div className={`w-32 h-32 rounded-full border-4 border-dashed border-[#4A90E2] flex items-center justify-center overflow-hidden
            ${profile.photo ? 'border-solid bg-white' : 'bg-[#F5F5F5]'}`}>
            {profile.photo ? (
              <img src={profile.photo} alt="Pet" className="w-full h-full object-cover rounded-full" />
            ) : (
              <Camera className="w-8 h-8 text-[#4A90E2]" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-[#4A90E2] rounded-full p-2 cursor-pointer hover:bg-[#357ABD] transition-colors">
            <Upload className="w-4 h-4 text-white" />
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
        </div>
        <p className="mt-2 text-sm text-[#666666]">Upload your pet's photo</p>
      </div>

      {/* Basic Info */}
      <div>
        <label className="block text-sm font-medium text-[#333333] mb-1">
          Pet's Name
        </label>
        <input
          type="text"
          value={profile.name}
          onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-colors"
          placeholder="E.g., Max, Luna, Bella"
        />
      </div>

      {/* Species Selection */}
      <div>
        <label className="block text-sm font-medium text-[#333333] mb-2">
          Species
        </label>
        <div className="grid grid-cols-5 gap-2">
          {[
            { type: 'dog' as const, icon: Dog },
            { type: 'cat' as const, icon: Cat },
            { type: 'bird' as const, icon: Bird },
            { type: 'fish' as const, icon: Fish },
            { type: 'other' as const, icon: PawPrint }
          ].map(({ type, icon: Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => handleSpeciesSelect(type)}
              className={`p-4 rounded-lg border-2 transition-all ${
                profile.species === type
                  ? 'border-[#4A90E2] bg-[#4A90E2]/10'
                  : 'border-gray-200 hover:border-[#4A90E2]'
              }`}
            >
              <Icon className={`w-6 h-6 mx-auto ${
                profile.species === type ? 'text-[#4A90E2]' : 'text-[#666666]'
              }`} />
              <span className="block text-xs mt-1 capitalize">{type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Breed */}
      <div>
        <label className="block text-sm font-medium text-[#333333] mb-1">
          Breed
        </label>
        <input
          type="text"
          value={profile.breed}
          onChange={e => setProfile(prev => ({ ...prev, breed: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-colors"
          placeholder="E.g., Golden Retriever, Persian"
        />
      </div>

      {/* Age and Weight */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Age
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={profile.age}
              onChange={e => setProfile(prev => ({ ...prev, age: e.target.value }))}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-colors"
              placeholder="Age"
            />
            <select
              value={profile.ageUnit}
              onChange={e => setProfile(prev => ({ ...prev, ageUnit: e.target.value as 'years' | 'months' }))}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-colors"
            >
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Weight
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={profile.weight}
              onChange={e => setProfile(prev => ({ ...prev, weight: e.target.value }))}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-colors"
              placeholder="Weight"
            />
            <select
              value={profile.weightUnit}
              onChange={e => setProfile(prev => ({ ...prev, weightUnit: e.target.value as 'kg' | 'lb' }))}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-colors"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Activity Level */}
      <div>
        <label className="block text-sm font-medium text-[#333333] mb-2">
          Activity Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { level: 'low' as const, label: 'Low', description: 'Mostly indoor, light play' },
            { level: 'medium' as const, label: 'Medium', description: 'Regular walks and play' },
            { level: 'high' as const, label: 'High', description: 'Very active, intense exercise' }
          ].map(({ level, label, description }) => (
            <button
              key={level}
              type="button"
              onClick={() => setProfile(prev => ({ ...prev, activityLevel: level }))}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                profile.activityLevel === level
                  ? 'border-[#4A90E2] bg-[#4A90E2]/10'
                  : 'border-gray-200 hover:border-[#4A90E2]'
              }`}
            >
              <span className={`block font-medium ${
                profile.activityLevel === level ? 'text-[#4A90E2]' : 'text-[#333333]'
              }`}>{label}</span>
              <span className="block text-xs mt-1 text-[#666666]">{description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Health Conditions */}
      <div>
        <label className="block text-sm font-medium text-[#333333] mb-2">
          Health Conditions
        </label>
        <div className="grid grid-cols-2 gap-2">
          {healthConditionOptions.map(condition => (
            <label
              key={condition}
              className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                profile.healthConditions.includes(condition)
                  ? 'border-[#4A90E2] bg-[#4A90E2]/10'
                  : 'border-gray-200 hover:border-[#4A90E2]'
              }`}
            >
              <input
                type="checkbox"
                checked={profile.healthConditions.includes(condition)}
                onChange={() => handleHealthConditionToggle(condition)}
                className="hidden"
              />
              <span className={profile.healthConditions.includes(condition) ? 'text-[#4A90E2]' : 'text-[#333333]'}>
                {condition}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Dietary Preferences */}
      <div>
        <label className="block text-sm font-medium text-[#333333] mb-2">
          Dietary Preferences
        </label>
        <div className="grid grid-cols-2 gap-2">
          {dietaryOptions.map(diet => (
            <label
              key={diet}
              className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                profile.dietaryPreferences.includes(diet)
                  ? 'border-[#4A90E2] bg-[#4A90E2]/10'
                  : 'border-gray-200 hover:border-[#4A90E2]'
              }`}
            >
              <input
                type="checkbox"
                checked={profile.dietaryPreferences.includes(diet)}
                onChange={() => handleDietaryPreferenceToggle(diet)}
                className="hidden"
              />
              <span className={profile.dietaryPreferences.includes(diet) ? 'text-[#4A90E2]' : 'text-[#333333]'}>
                {diet}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-[#333333] mb-1">
          Additional Notes
        </label>
        <textarea
          value={profile.notes}
          onChange={e => setProfile(prev => ({ ...prev, notes: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-colors"
          placeholder="Any special requirements or preferences?"
          rows={4}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] relative overflow-hidden">
      {/* Floating Pet Animations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 animate-float-slow">
          <Dog className="w-12 h-12 text-[#4A90E2] opacity-20" />
        </div>
        <div className="absolute top-40 right-20 animate-float-medium">
          <Cat className="w-10 h-10 text-[#FF6F61] opacity-20" />
        </div>
        <div className="absolute bottom-32 left-[20%] animate-float-fast">
          <Bird className="w-8 h-8 text-[#A8E6CF] opacity-20" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-slow"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            <PawPrint className="w-6 h-6 text-[#A8E6CF] opacity-20" />
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Heart className="h-12 w-12 text-[#FF6F61]" />
              <PawPrint className="h-6 w-6 text-[#4A90E2] absolute -bottom-1 -right-1" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#333333] mb-2">
            Let's Get to Know Your Pet! 🐾
          </h1>
          <p className="text-[#666666]">
            Fill in your pet's details to unlock personalized health insights
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2].map(step => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step <= currentStep ? 'bg-[#4A90E2] text-white' : 'bg-[#F5F5F5] text-[#666666]'
              }`}>
                {step < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step
                )}
              </div>
              {step < 2 && (
                <div className={`w-20 h-1 mx-2 rounded ${
                  step < currentStep ? 'bg-[#4A90E2]' : 'bg-[#F5F5F5]'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        {!showSuccess ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit}>
              {currentStep === 1 ? renderStep1() : renderStep2()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 text-[#4A90E2] hover:text-[#357ABD] transition-colors"
                  >
                    Back
                  </button>
                )}
                {currentStep < 2 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="ml-auto flex items-center px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-auto flex items-center px-6 py-3 bg-[#FF6F61] text-white rounded-lg hover:bg-[#ff8a7f] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <PawPrint className="w-5 h-5 mr-2" />
                        Complete Setup
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#333333] mb-2">
              Profile Created Successfully! 🎉
            </h2>
            <p className="text-[#666666] mb-6">
              Your pet's profile has been set up and we're ready to provide personalized care recommendations.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                View Dashboard
              </button>
              <button className="px-6 py-3 border-2 border-[#4A90E2] text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/10 transition-colors flex items-center">
                <Share2 className="w-5 h-5 mr-2" />
                Share Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetProfileSetup;