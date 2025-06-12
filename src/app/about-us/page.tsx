export default function AboutUs() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">About VHM Construction</h1>
      <p className="text-lg text-gray-700 mb-6">
        <span className="font-semibold">VHM Construction Ltd</span> is a professional construction company based in Bristol, UK. With a commitment to quality craftsmanship, reliability, and customer satisfaction, we deliver outstanding residential and commercial projects across the region.
      </p>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Our Mission</h2>
        <p className="text-gray-700">
          To create safe, functional, and beautiful spaces for our clients, while ensuring a smooth and transparent building process every step of the way.
        </p>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Contact Information</h2>
        <ul className="text-gray-700">
          <li><strong>Address:</strong> 204 Bells Lane Hoo Rochester England ME3 9GD</li>
          <li><strong>Email:</strong> vhmconstructionltd@gmail.com</li>
          <li><strong>Phone:</strong> +44 7342 106747</li>
        </ul>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Why Choose Us?</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Experienced, certified, and friendly team</li>
          <li>Attention to detail and commitment to deadlines</li>
          <li>Full transparency and communication throughout your project</li>
          <li>Competitive pricing with no hidden costs</li>
        </ul>
      </div>
    </main>
  );
}