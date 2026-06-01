"use client";

import { useEffect, useState } from "react";

export default function Home() {

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [interviewTime, setInterviewTime] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false)

  const [interviews, setInterviews] = useState([]);

  /*
  -----------------------------------
  FETCH INTERVIEWS
  -----------------------------------
  */

  const fetchInterviews = async () => {

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/interviews`
      );

      const data = await res.json();

      setInterviews(data);

    } catch (error) {

      console.log(error);

    }
  };

  /*
  -----------------------------------
  LOAD DATA
  -----------------------------------
  */

  useEffect(() => {

    fetchInterviews();

  }, []);

  /*
  -----------------------------------
  CHECK DB
  -----------------------------------
  */

  const checkDBConnection = async () => {
    setMessage(null);
    setIsError(false);
    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/check-db`
      );

      const data = await res.json();

      setMessage(data.message);

    } catch (error) {
      setIsError(true);
      setMessage("Database connection failed");

    }
  };

  /*
  -----------------------------------
  SUBMIT FORM
  -----------------------------------
  */

  const submitInterviewForm = async () => {

    setIsError(false);
    setMessage(null);

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submit-interview`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            designation,
            interview_time: interviewTime,
          }),
        }
      );

      const data = await res.json();

      setMessage(data.message);

      if (data.success) {

        setShowModal(false);

        setName("");
        setDesignation("");
        setInterviewTime("");

        fetchInterviews();
      }

    } catch (error) {
      setIsError(true);
      setMessage("Submission failed");

    }
  };

  return (

    <main className="min-h-screen bg-gray-100">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-8 shadow-lg">

        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold">
              Interview Management System
            </h1>

            <p className="mt-2 text-blue-100">
              Next.js + Node.js + MySQL Demo Project
            </p>

          </div>

          <div className="flex gap-4">

            <button
              onClick={checkDBConnection}
              className="bg-green-500 hover:bg-green-600 px-5 py-3 rounded-lg font-semibold"
            >
              Check DB Status
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-blue-700 hover:bg-gray-200 px-5 py-3 rounded-lg font-semibold"
            >
              + Add Interview
            </button>

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div className="max-w-7xl mx-auto p-8">

        {/* STATUS MESSAGE */}

        {message && (

          <div className={`${isError ? "bg-red-100 border border-red-300 text-red-700": "bg-green-100 border border-green-300 text-green-700"} mb-6  p-4 rounded-lg`}>

            {message}

          </div>

        )}

        {/* CARDS */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-gray-500 text-sm">
              Total Interviews
            </h2>

            <p className="text-4xl font-bold mt-2 text-blue-700">
              {interviews.length}
            </p>

          </div>

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-gray-500 text-sm">
              Today's Schedule
            </h2>

            <p className="text-4xl font-bold mt-2 text-indigo-700">
              {interviews.length}
            </p>

          </div>

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-gray-500 text-sm">
              Database Status
            </h2>

            <div className="text-2xl font-bold mt-2 text-green-600">
                  {message ?(

          <div className={` ${isError ? "bg-red-100 border border-red-300 text-red-700" :"bg-green-100 border border-green-300 text-green-700"} mb-6  p-4 rounded-lg`}>

            {message}

          </div>

        ) :(<p>No status</p>)}
            </div>

          </div>

        </div>

        {/* TABLE */}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

          <div className="p-6 border-b">

            <h2 className="text-2xl font-bold">
              Interview List
            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="text-left p-4">
                    ID
                  </th>

                  <th className="text-left p-4">
                    Candidate Name
                  </th>

                  <th className="text-left p-4">
                    Designation
                  </th>

                  <th className="text-left p-4">
                    Interview Time
                  </th>

                </tr>

              </thead>

              <tbody>

                {interviews.length > 0 ? (

                  interviews.map((item) => (

                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4">
                        #{item.id}
                      </td>

                      <td className="p-4 font-medium">
                        {item.name}
                      </td>

                      <td className="p-4">
                        {item.designation}
                      </td>

                      <td className="p-4">
                        {item.interview_time}
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="4"
                      className="text-center p-10 text-gray-500"
                    >
                      No interview records found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[450px]">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Add Interview
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 text-xl"
              >
                ✕
              </button>

            </div>

            {/* NAME */}

            <div className="mb-4">

              <label className="block mb-2 font-medium">
                Candidate Name
              </label>

              <input
                type="text"
                placeholder="Enter candidate name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* DESIGNATION */}

            <div className="mb-4">

              <label className="block mb-2 font-medium">
                Designation
              </label>

              <input
                type="text"
                placeholder="Enter designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* TIME */}

            <div className="mb-6">

              <label className="block mb-2 font-medium">
                Interview Time
              </label>

              <input
                type="datetime-local"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* BUTTONS */}

            <div className="flex gap-4">

              <button
                onClick={submitInterviewForm}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-lg font-semibold"
              >
                Submit Interview
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-300 hover:bg-gray-400 p-3 rounded-lg font-semibold"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}