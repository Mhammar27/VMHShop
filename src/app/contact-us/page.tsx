"use client";

import { useState } from "react";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data; this is just a demo.
  };

  return (
    <main className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-8">
        We&apos;re here to help! Reach out to VMH Construction Ltd with your questions, requests, or feedback.
      </p>
      <div className="mb-10">
        <ul className="text-gray-700">
          <li>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:vhmconstructionltd@gmail.com"
              className="text-blue-600 underline"
            >
              vhmconstructionltd@gmail.com
            </a>
          </li>
          <li>
            <strong>Phone:</strong>{" "}
            <a
              href="tel:+447342106747"
              className="text-blue-600 underline"
            >
              +44 7342 106747
            </a>
          </li>
          <li>
            <strong>Address:</strong> 204 Bells Lane Hoo Rochester England ME3 9GD
          </li>
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Send Us a Message</h2>
        <div className="mb-4">
          <label className="block text-sm mb-1" htmlFor="name">
            Name
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1" htmlFor="email">
            Email
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1" htmlFor="message">
            Message
          </label>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[100px]"
            id="message"
            name="message"
            required
            value={form.message}
            onChange={handleChange}
          />
        </div>
        {submitted && (
          <div className="mb-4 text-green-600">
            Thank you for your message! We&apos;ll reply soon.
          </div>
        )}
        <button
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 transition"
          type="submit"
          disabled={submitted}
        >
          {submitted ? "Sent!" : "Send Message"}
        </button>
      </form>
    </main>
  );
}