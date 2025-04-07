import React, { useState, useRef } from 'react';
import {
  Dog,
  Cat,
  Upload,
  Download,
  Share2,
  CheckCircle,
  AlertCircle,
  PieChart,
  Send,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface PetProfile {
  name: string;
  age: string;
  breed: string;
  weight: string;
  activityLevel: 'Low' | 'Medium' | 'High';
  healthConditions: string[];
}

interface DietaryPreferences {
  foodTypes: string[];
  allergens: string[];
  customRestrictions: string;
}

const DietPlanner: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [petProfile, setPetProfile] = useState<PetProfile>({
    name: '',
    age: '',
    breed: '',
    weight: '',
    activityLevel: 'Medium',
    healthConditions: [],
  });
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreferences>({
    foodTypes: [],
    allergens: [],
    customRestrictions: '',
  });
  const [showMealPlan, setShowMealPlan] = useState(false);
  const [isVetApproved, setIsVetApproved] = useState(false);

  const activityLevels = ['Low', 'Medium', 'High'];
  const foodTypes = ['Dry Food', 'Wet Food', 'Raw Food', 'Homemade Meals'];
  const commonAllergens = ['Chicken', 'Beef', 'Grains', 'Dairy', 'Fish'];
  const healthConditionOptions = ['Diabetes', 'Heart Disease', 'Kidney Disease', 'Food Allergies', 'Joint Issues'];

  // Reference to the element that contains the diet plan
  const dietPlanRef = useRef<HTMLDivElement>(null);

  const handleGenerateMealPlan = async () => {
    setError(null);

    if (!petProfile.name || !petProfile.weight || !petProfile.age || !petProfile.breed) {
      setError('Please fill in all required pet profile fields');
      return;
    }

    if (dietaryPreferences.foodTypes.length === 0) {
      setError('Please select at least one food type');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/dietplanner/generate-diet-plan', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          petProfile: {
            name: petProfile.name,
            age: petProfile.age,
            breed: petProfile.breed,
            weight: petProfile.weight,
            activityLevel: petProfile.activityLevel,
            healthConditions: petProfile.healthConditions,
          },
          dietaryPreferences: {
            foodTypes: dietaryPreferences.foodTypes,
            allergens: dietaryPreferences.allergens,
            customRestrictions: dietaryPreferences.customRestrictions,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success') {
        // Set the diet plan markdown response
        setDietPlan(data.data);
        setShowMealPlan(true);
      } else {
        throw new Error(data.error || 'Failed to generate diet plan');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVetApproval = () => {
    setIsVetApproved(true);
  };

  const handleDownloadPDF = async () => {
    if (!dietPlanRef.current) return;
    // Capture the element as a canvas with higher scale for better resolution
    const canvas = await html2canvas(dietPlanRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    // Initialize jsPDF with A4 dimensions in mm
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
  
    // Calculate the image height in PDF units keeping aspect ratio
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
    let heightLeft = imgHeight;
    let position = 0;
  
    // Add the first page
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;
  
    // Add extra pages if necessary
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
  
    pdf.save('diet-plan.pdf');
  };
  
  return (
    <div className="min-h-screen bg-[#F5F5F5] relative overflow-hidden">
      {/* Floating Background Animations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 animate-float-slow">
          <Dog className="w-8 h-8 text-[#A8E6CF] opacity-20" />
        </div>
        <div className="absolute top-40 right-20 animate-float-medium">
          <Cat className="w-6 h-6 text-[#A8E6CF] opacity-20" />
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#4A90E2] to-[#A8E6CF] p-6 shadow-lg relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-2">Pet Diet Planner</h1>
          <p className="text-white/90">
            Create a customized meal plan tailored to your pet's needs
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-8">
          {/* Pet Profile Section */}
          <div>
            <h2 className="text-xl font-semibold text-[#333333] mb-4">Pet Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-1">
                  Pet's Name
                </label>
                <input
                  type="text"
                  value={petProfile.name}
                  onChange={(e) => setPetProfile({ ...petProfile, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  placeholder="Enter pet's name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-1">
                  Age
                </label>
                <input
                  type="text"
                  value={petProfile.age}
                  onChange={(e) => setPetProfile({ ...petProfile, age: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  placeholder="Enter age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-1">
                  Breed
                </label>
                <input
                  type="text"
                  value={petProfile.breed}
                  onChange={(e) => setPetProfile({ ...petProfile, breed: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  placeholder="Enter breed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-1">
                  Weight (kg)
                </label>
                <input
                  type="text"
                  value={petProfile.weight}
                  onChange={(e) => setPetProfile({ ...petProfile, weight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  placeholder="Enter weight"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Activity Level
              </label>
              <div className="flex gap-4">
                {activityLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setPetProfile({ ...petProfile, activityLevel: level as any })}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      petProfile.activityLevel === level
                        ? 'bg-[#4A90E2] text-white'
                        : 'bg-[#F5F5F5] text-[#333333] hover:bg-[#E5E5E5]'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Health Conditions */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Health Conditions
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {healthConditionOptions.map((condition) => (
                  <label key={condition} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={petProfile.healthConditions.includes(condition)}
                      onChange={(e) => {
                        const updatedConditions = e.target.checked
                          ? [...petProfile.healthConditions, condition]
                          : petProfile.healthConditions.filter((c) => c !== condition);
                        setPetProfile({ ...petProfile, healthConditions: updatedConditions });
                      }}
                      className="rounded border-gray-300 text-[#4A90E2] focus:ring-[#4A90E2]"
                    />
                    <span className="text-sm text-[#333333]">{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Vet Report Upload */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Upload Vet Report (Optional)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-[#F5F5F5] text-[#333333] rounded-lg tracking-wide cursor-pointer hover:bg-[#E5E5E5] transition-colors">
                  <Upload className="w-8 h-8 mb-2 text-[#4A90E2]" />
                  <span className="text-sm">Click to upload vet report</span>
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Dietary Preferences Section */}
          <div>
            <h2 className="text-xl font-semibold text-[#333333] mb-4">Dietary Preferences</h2>
            {/* Food Types */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Preferred Food Types
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {foodTypes.map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={dietaryPreferences.foodTypes.includes(type)}
                      onChange={(e) => {
                        const updatedTypes = e.target.checked
                          ? [...dietaryPreferences.foodTypes, type]
                          : dietaryPreferences.foodTypes.filter((t) => t !== type);
                        setDietaryPreferences({ ...dietaryPreferences, foodTypes: updatedTypes });
                      }}
                      className="rounded border-gray-300 text-[#4A90E2] focus:ring-[#4A90E2]"
                    />
                    <span className="text-sm text-[#333333]">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Allergens */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Allergies & Restrictions
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {commonAllergens.map((allergen) => (
                  <label key={allergen} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={dietaryPreferences.allergens.includes(allergen)}
                      onChange={(e) => {
                        const updatedAllergens = e.target.checked
                          ? [...dietaryPreferences.allergens, allergen]
                          : dietaryPreferences.allergens.filter((a) => a !== allergen);
                        setDietaryPreferences({ ...dietaryPreferences, allergens: updatedAllergens });
                      }}
                      className="rounded border-gray-300 text-[#4A90E2] focus:ring-[#4A90E2]"
                    />
                    <span className="text-sm text-[#333333]">{allergen}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Restrictions */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Additional Dietary Restrictions
              </label>
              <textarea
                value={dietaryPreferences.customRestrictions}
                onChange={(e) =>
                  setDietaryPreferences({ ...dietaryPreferences, customRestrictions: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                rows={3}
                placeholder="Enter any additional dietary restrictions or notes"
              />
            </div>
          </div>

          {loading && (
            <div className="text-center">
              <span className="text-[#4A90E2]">Generating meal plan...</span>
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center">
              <AlertCircle className="w-5 h-5 inline mr-2" />
              {error}
            </div>
          )}

          {/* Generate Button */}
          <div className="text-center">
            <button
              onClick={handleGenerateMealPlan}
              className="bg-[#4A90E2] text-white px-4 py-2 rounded-md hover:bg-[#357ABD] flex items-center space-x-2 mx-auto"
            >
              <PieChart className="w-5 h-5" />
              <span>Generate Meal Plan</span>
            </button>
          </div>

          {/* Meal Plan Display using ReactMarkdown */}
          {showMealPlan && dietPlan && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-[#333333] mb-4">Your Customized Meal Plan</h2>
              <div ref={dietPlanRef} className="bg-[#F5F5F5] p-4 rounded-lg">
                <ReactMarkdown>{dietPlan}</ReactMarkdown>
              </div>
              <div className="flex flex-wrap gap-4 justify-center mt-4">
                <button
                  onClick={handleVetApproval}
                  className="px-4 py-2 rounded-md flex items-center space-x-2 bg-[#4A90E2] text-white hover:bg-[#357ABD]"
                >
                  {isVetApproved ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Vet Approved</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Get Vet Approval</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="bg-[#4A90E2] text-white px-4 py-2 rounded-md hover:bg-[#357ABD] flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </button>
                <button className="bg-[#4A90E2] text-white px-4 py-2 rounded-md hover:bg-[#357ABD] flex items-center space-x-2">
                  <Share2 className="w-5 h-5" />
                  <span>Share Plan</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietPlanner;
