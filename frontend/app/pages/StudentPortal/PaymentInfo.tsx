"use client";

import { useState, useEffect } from "react";
import "./style/PaymentInfo.css";
import CircularProgressBar from "./CircularProgressBar";
import Image from "next/image";
import PaymentImage from "./images/software-tester-tech-journalist.jpg";

// Types
interface PaymentRecord {
  semester: string;
  installment: string;
  amountPaid: number;
  status: string;
  transactionId: string;
  date: string;
}

interface PaymentDetails {
  userForm?: {
    paystack?: {
      records?: PaymentRecord[];
    };
  };
}

interface PaymentProgress {
  "First Semester": number;
  "Second Semester": number;
  "Third Semester": number;
}

interface PaymentInfoProps {
  email?: string;
}

interface UserData {
  email: string;
  name?: string;
}

const PaymentInfo = ({ email }: PaymentInfoProps) => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  const [paymentProgress, setPaymentProgress] = useState<PaymentProgress>({
    "First Semester": 0,
    "Second Semester": 0,
    "Third Semester": 0,
  });

  const [totalPaid, setTotalPaid] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);

  // Get user
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const userData = localStorage.getItem("user");
        let userEmail = email;
        const token = localStorage.getItem("token");

        if (!userEmail && userData) {
          userEmail = JSON.parse(userData).email;
        }

        if (userEmail) {
          const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          const [detailsRes, progressRes] = await Promise.all([
            fetch(`${API_URL}/api/fees/${userEmail}`, {
              headers: { Authorization: token ? `Bearer ${token}` : "" },
            }),
            fetch(
              `${API_URL}/api/progress/payment-progress/${userEmail}`,
              {
                headers: { Authorization: token ? `Bearer ${token}` : "" },
              }
            ),
          ]);

          if (!detailsRes.ok) throw new Error("Failed to fetch details");
          if (!progressRes.ok) throw new Error("Failed to fetch progress");

          const detailsData = await detailsRes.json();
          const progressData = await progressRes.json();

          setPaymentDetails(detailsData);
          setPaymentProgress(progressData);

          calculateTotals(detailsData.userForm);
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error occurred");
        setLoading(false);
      }
    };

    fetchData();
  }, [email]);

  // Calculate totals
  const calculateTotals = (paymentData: any) => {
    if (!paymentData?.paystack?.records) {
      setTotalPaid(0);
      setRemainingBalance(0);
      return;
    }

    const total = paymentData.paystack.records.reduce(
      (sum: number, record: PaymentRecord) => sum + (record.amountPaid || 0),
      0
    );

    setTotalPaid(total);

    const expected = 2000 + 2000 + 1920;
    const remaining = expected - total;

    setRemainingBalance(remaining > 0 ? remaining : 0);
  };

  // Loading UI
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  // Properly typed grouping
  const groupRecordsBySemester = (): Record<
    string,
    {
      First: PaymentRecord[];
      Second: PaymentRecord[];
      Third: PaymentRecord[];
    }
  > => {
    const semesters = ["First Semester", "Second Semester", "Third Semester"];
    const grouped: any = {};

    semesters.forEach((semester) => {
      const records =
        paymentDetails?.userForm?.paystack?.records?.filter(
          (r) => r.semester === semester
        ) || [];

      grouped[semester] = {
        First: records.filter((r) => r.installment === "First Installment"),
        Second: records.filter((r) => r.installment === "Second Installment"),
        Third: records.filter((r) => r.installment === "Third Installment"),
      };
    });

    return grouped;
  };

  const semesterGroups = groupRecordsBySemester();

  // Progress
  const calculateOverallProgress = () => {
    const total = 3 * (2000 + 2000 + 1920);
    const progress = total > 0 ? (totalPaid / total) * 100 : 0;
    return Math.round(progress * 100) / 100;
  };

  return (
    <div className="Payment-container">
      <h2>Hello {user?.name || "Student"}</h2>

      <CircularProgressBar
        percentage={calculateOverallProgress()}
        size={190}
        strokeWidth={17}
      />

      <div>
        <p>Total Paid: Ghc {totalPaid.toLocaleString()}</p>
        <p>Remaining: Ghc {remainingBalance.toLocaleString()}</p>
      </div>

      {Object.entries(semesterGroups).map(([semester, installmentGroups]) => (
        <div key={semester}>
          <h3>{semester}</h3>

          {Object.entries(
            installmentGroups as {
              First: PaymentRecord[];
              Second: PaymentRecord[];
              Third: PaymentRecord[];
            }
          ).map(([installment, records]) => {
            const typedRecords = records as PaymentRecord[];

            return (
              <div key={installment}>
                <h4>{installment} Installment</h4>

                {typedRecords.map((record, index) => (
                  <div key={index}>
                    <p>Status: {record.status}</p>
                    <p>Transaction: {record.transactionId}</p>
                    <p>Amount: Ghc {record.amountPaid}</p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default PaymentInfo;