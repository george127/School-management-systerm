"use client"; 

import { useState } from "react";
import PersonalDetails from "./PersonalDetails";
import EducationalBackground from './EducationalBackground';
import ProgramApplyingFor from './ProgramApplyingFor';
import GuardianDetails from './GuardianDetails';

export default function StudentForm() {
  // State to control visibility of each form section
  const [showProgramApplyingFor, setShowProgramApplyingFor] = useState(false);
  const [showEducationalBackground, setShowEducationalBackground] = useState(false);
  const [showGuardianDetails, setShowGuardianDetails] = useState(false);

  // Function to show the next form section based on the current one
  const handleShowNext = (currentSection) => {
    if (currentSection === "personalDetails") {
      setShowProgramApplyingFor(true);
    } else if (currentSection === "programApplyingFor") {
      setShowEducationalBackground(true);
    } else if (currentSection === "educationalBackground") {
      setShowGuardianDetails(true);
    }
  };

  return (
    <div>
      <div className="container">
        <br />
        
        {/* Always show PersonalDetails */}
        <PersonalDetails handleShowNext={() => handleShowNext("personalDetails")} />

        {/* Conditionally render ProgramApplyingFor */}
        {showProgramApplyingFor && (
          <ProgramApplyingFor handleShowNext={() => handleShowNext("programApplyingFor")} />
        )}

        {/* Conditionally render EducationalBackground */}
        {showEducationalBackground && (
          <EducationalBackground handleShowNext={() => handleShowNext("educationalBackground")} />
        )}

        {/* Conditionally render GuardianDetails */}
        {showGuardianDetails && <GuardianDetails />}
      </div>
    </div>
  );
}