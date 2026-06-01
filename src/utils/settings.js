import { subscriptionPlans as defaultPlans, paymentMethods as defaultMethods } from "../data/articles";

export const getSubscriptionPlans = () => {
  try {
    const plans = localStorage.getItem("wp_subscription_plans");
    if (plans) {
      return JSON.parse(plans);
    }
  } catch (e) {
    console.error("Failed to parse subscription plans", e);
  }
  // Initialize if not present
  localStorage.setItem("wp_subscription_plans", JSON.stringify(defaultPlans));
  return defaultPlans;
};

export const saveSubscriptionPlans = (plans) => {
  localStorage.setItem("wp_subscription_plans", JSON.stringify(plans));
};

export const getPaymentMethods = () => {
  try {
    const methods = localStorage.getItem("wp_payment_methods");
    if (methods) {
      return JSON.parse(methods);
    }
  } catch (e) {
    console.error("Failed to parse payment methods", e);
  }
  // Initialize if not present
  localStorage.setItem("wp_payment_methods", JSON.stringify(defaultMethods));
  return defaultMethods;
};

export const savePaymentMethods = (methods) => {
  localStorage.setItem("wp_payment_methods", JSON.stringify(methods));
};
