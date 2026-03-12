"use client";

import "./FeeSelectionPage.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import feeimage1 from "../../assets/feeimage1.jpeg";
import feeimage2 from "../../assets/feeimage2.jpeg";
import feeimage3 from "../../assets/feeimage3.jpeg";
import feeimage4 from "../../assets/feeimage4.jpeg";
import Footer from "../../components/footer/Footer";
import Header from "../../components/Header/HeaderPage";
import Navigation from "../../components/Navigation/NavPage";

// Types
interface PaymentStatus {
  [semester: string]: {
    [installment: string]: string;
  };
}

interface UserData {
  email: string;
  name?: string;
}

function FeeSelectionPage() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [semester, setSemester] = useState("");
  const [installment, setInstallment] = useState("");
  const [amount, setAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({});

  const paymentLinks: Record<number, string> = {
    2000: "https://paystack.shop/pay/7faz2q19tm",
    1920: "https://paystack.shop/pay/7faz2q19tm",
  };

  // Get user email and payment status
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user: UserData = JSON.parse(userData);
        if (user.email) {
          setEmail(user.email);
          fetchPaymentStatus(user.email);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const fetchPaymentStatus = async (userEmail: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://acg-7euk.onrender.com/api/fees/payment-status/${userEmail}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch payment status");
      }

      const data = await response.json();
      console.log("Payment status received:", data);
      setPaymentStatus(data);
    } catch (error) {
      console.error("Error fetching payment status:", error);
      setPaymentStatus({});
    }
  };

  const handlePayment = (
    amount: number,
    semester: string,
    installment: string,
  ) => {
    console.log("Button clicked!", { amount, semester, installment });
    setAmount(amount);
    setSemester(semester);
    setInstallment(installment);
    setShowModal(true);
  };

  // MODIFIED: Direct Paystack redirect without backend call
  const handleSubmit = () => {
    console.log("Redirecting to Paystack...", { email, semester, installment, amount });
    
    const paymentLink = paymentLinks[amount];
    if (!paymentLink) {
      console.error(`No payment link for amount: ${amount}`);
      return;
    }

    // Add metadata to track the payment
    const redirectUrl = `${paymentLink}?metadata=${encodeURIComponent(
      JSON.stringify({ email, semester, installment, amount }),
    )}`;
    
    console.log("Redirecting to:", redirectUrl);
    window.location.href = redirectUrl;
  };

  // Check if installment is paid
  const isInstallmentPaid = (
    semester: string,
    installment: string,
  ): boolean => {
    if (!paymentStatus || Object.keys(paymentStatus).length === 0) {
      return false;
    }

    return (
      paymentStatus[semester] &&
      (paymentStatus[semester][installment] === "paid" ||
        paymentStatus[semester][installment] === "success")
    );
  };

  // Check if ALL installments in a semester are paid
  const isSemesterCompleted = (semester: string): boolean => {
    const installments = [
      "First Installment",
      "Second Installment",
      "Third Installment",
    ];
    return installments.every((installment) =>
      isInstallmentPaid(semester, installment),
    );
  };

  // Check if previous installment is paid
  const isInstallmentAvailable = (
    semester: string,
    installment: string,
  ): boolean => {
    if (semester === "First Semester" && installment === "First Installment") {
      return true;
    }

    const installments = [
      "First Installment",
      "Second Installment",
      "Third Installment",
    ];
    const currentIndex = installments.indexOf(installment);

    if (!paymentStatus[semester]) {
      return currentIndex === 0;
    }

    if (currentIndex === 0) {
      const previousSemester =
        semester === "Second Semester" ? "First Semester" : "Second Semester";
      return isSemesterCompleted(previousSemester);
    }

    const previousInstallment = installments[currentIndex - 1];
    return isInstallmentPaid(semester, previousInstallment);
  };

  // Render payment button
  const renderPaymentButton = (
    amount: number,
    semester: string,
    installmentName: string,
  ) => {
    const isPaid = isInstallmentPaid(semester, installmentName);
    const isAvailable = isInstallmentAvailable(semester, installmentName);

    return (
      <button
        className={`btn ${isPaid ? "btn-paid" : !isAvailable ? "btn-disabled" : ""}`}
        onClick={() => handlePayment(amount, semester, installmentName)}
        disabled={isPaid || !isAvailable}
      >
        {isPaid ? "Paid" : "Pay Now"}
        <span className="material-symbols-outlined">east</span>
      </button>
    );
  };

  return (
    <>
      <Header />
      <Navigation />
      <div className="layout container">
        <div className="layout-container">
          {/* Left Section */}
          <div className="image-grid">
            <Image
              src={feeimage1}
              alt="Placeholder 1"
              width={200}
              height={150}
            />
            <Image
              src={feeimage2}
              alt="Placeholder 2"
              width={200}
              height={150}
            />
            <Image
              src={feeimage3}
              alt="Placeholder 3"
              width={200}
              height={150}
            />
            <Image
              src={feeimage4}
              alt="Placeholder 4"
              width={200}
              height={150}
            />
          </div>

          {/* Right Section */}
          <div className="text-content">
            <h1>Hey there, Welcome to Our First Installment Fees Structure</h1>
            <p>
              Fees cover internet services, learning materials, activities, and
              support services. AppCode&apos;s academic year consists of three
              semesters.
            </p>
            <div className="payment-options">
              <div className="payment-card">
                <div className="payment-item">
                  <i className="bi bi-book me-2"></i>
                  <span>Semester One</span>
                </div>
                <br />
                <div className="text">
                  This semester focuses on foundational concepts, and basic
                  skills development.
                </div>
              </div>
              <div className="payment-card">
                <div className="payment-item">
                  <i className="bi bi-journal-text me-2"></i>
                  <span>Semester Two</span>
                </div>
                <br />
                <div className="text">
                  Dive deeper into intermediate topics projects to build on your
                  knowledge.
                </div>
              </div>
              <div className="payment-card">
                <div className="payment-item">
                  <i className="bi bi-mortarboard me-2"></i>
                  <span>Semester Three</span>
                </div>
                <br />
                <div className="text">
                  Advanced subjects and capstone projects are the focus,
                  preparing you for opportunities.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fees-flip-cards">
          <h2>Tuition And Other Fees</h2>
          <br />
          <div className="cards-container">
            <div className="flip-card">
              <div className="card-front">
                <h3>1st Semester</h3>
              </div>
              <div className="card-back">
                <p>Gh¢ 5,920.00</p>
                <p>USD: $402.25</p>
              </div>
            </div>
            <div className="flip-card">
              <div className="card-front">
                <h3>2nd Semester</h3>
              </div>
              <div className="card-back">
                <p>Gh¢ 5,920.00</p>
                <p>USD: $402.25</p>
              </div>
            </div>
            <div className="flip-card">
              <div className="card-front">
                <h3>3rd Semester</h3>
              </div>
              <div className="card-back">
                <p>Gh¢ 5,920.00</p>
                <p>USD: $402.25</p>
              </div>
            </div>
          </div>
        </div>

        <div className="price-field">
          <div className="pricing-item">
            <div className="item">
              <h2>First Installment</h2>
              <p>
                This initial payment includes admission processing fees,
                administrative costs, and other essential onboarding services.
              </p>
            </div>
          </div>
          <div className="pricing-item">
            <div className="item-list">
              <div className="list">
                <i className="bi bi-check-circle me-2"></i>
                Access to student portal
              </div>
              <div className="list">
                <i className="bi bi-check-circle me-2"></i>
                Campus development and maintenance fee
              </div>
              <div className="list">
                <i className="bi bi-check-circle me-2"></i>
                Library and ICT services subscription
              </div>
              <div className="list">
                <i className="bi bi-check-circle me-2"></i>
                learning resources
              </div>
            </div>
            <div className="price">
              <p>Gh¢ 3,000.00</p>
            </div>
            <div className="btn-container">
              {renderPaymentButton(2000, "First Semester", "First Installment")}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="payment-summary">
              <div className="summary-header">
                <div className="summary-icon">
                  <span className="material-symbols-outlined">
                    receipt_long
                  </span>
                </div>
                <h3>Payment Summary</h3>
              </div>

              <div className="summary-content">
                <div className="summary-item">
                  <div className="item-icon">
                    <span className="material-symbols-outlined">school</span>
                  </div>
                  <div className="item-details">
                    <span className="item-label">Semester</span>
                    <span className="item-value">{semester}</span>
                  </div>
                </div>

                <div className="summary-item">
                  <div className="item-icon">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <div className="item-details">
                    <span className="item-label">Installment Plan</span>
                    <span className="item-value">{installment}</span>
                  </div>
                </div>

                <div className="summary-total">
                  <div className="total-icon">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <div className="total-details">
                    <span className="total-label">Total Amount Due</span>
                    <span className="total-amount">
                      Ghc {amount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="summary-footer">
                <div className="secure-notice">
                  <span className="material-symbols-outlined">lock</span>
                  <span>Secure payment processed by Paystack</span>
                </div>
              </div>
            </div>

            <div className="btn-container">
              <button
                onClick={handleSubmit}
                className="btn btn-submit"
              >
                Proceed to Paystack
                <span className="material-symbols-outlined">east</span>
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default FeeSelectionPage;