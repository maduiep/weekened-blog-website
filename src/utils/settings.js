import { subscriptionPlans as defaultPlans, paymentMethods as defaultMethods } from "../data/articles";

export const getSubscriptionPlans = () => {
  // Always override local storage with code values during development to prevent caching issues
  localStorage.setItem("wp_subscription_plans", JSON.stringify(defaultPlans));
  return defaultPlans;
};

export const saveSubscriptionPlans = (plans) => {
  localStorage.setItem("wp_subscription_plans", JSON.stringify(plans));
};

export const getPaymentMethods = () => {
  // Always override local storage with code values during development to prevent caching issues
  localStorage.setItem("wp_payment_methods", JSON.stringify(defaultMethods));
  return defaultMethods;
};

export const savePaymentMethods = (methods) => {
  localStorage.setItem("wp_payment_methods", JSON.stringify(methods));
};
