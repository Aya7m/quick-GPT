import React, { useEffect, useState } from "react";
import { dummyPlans } from "../assets/assets";
import Loading from "./Loading";
import { useAppContext } from "../context/Appcontext";
import toast from "react-hot-toast";

const Crediet = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, axios } = useAppContext();

  const fetchPlan = async () => {
    try {
      const res = await axios.get("/api/credit/plan", {
        headers: { Authorization: token },
      });
      if (res?.data.success) {
        setPlans(res.data.plans);
      } else {
        toast.error(res.data.message || "Failed to fetch plans");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    finally {
      setLoading(false);
    }
  };

  // purchase plan function
  const purchasePlan = async (planId) => {
    try {
      const res = await axios.post(
        "/api/credit/purchase",
        { planId },
        { headers: { Authorization: token } }
      );
      if (res?.data.success) {
       window.location.href = res.data.url;
      } else {
        toast.error(res.data.message || "Failed to purchase plan");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-semibold text-center mb-10 xl:mt-30 text-gray-800 dark:text-[#583C79]">
        Credit Plans
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`border border-gray-200 dark:bg-[#583C79] rounded-lg shadow hover:shadow-lg transition-shadow p-6 min-w-[300px] flex flex-col ${
              plan._id === "pro"
                ? "bg-purple-50 dark:bg-[#583C79]"
                : "bg-white dark:bg-transparent"
            }`}
          >
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-300 mb-4">
                ${plan.price}
                <span className="text-gray-600 dark:text-purple-200 text-base font-normal">
                  {" "}
                  /{plan.credits} credits
                </span>
              </p>
              <ul className="list-inside list-disc text-sm text-gray-700 dark:text-purple-200 space-y-1">
                {plan.features.map((feature, index) => {
                  <li key={index}>{feature}</li>;
                })}
              </ul>
            </div>
            <button onClick={()=>toast.promise(purchasePlan(plan._id), {loading:"Buying...",success:"Plan Purchased",error:"Failed to purchase plan"})} className="mt-6 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold py-2 px-4 rounded">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Crediet;
