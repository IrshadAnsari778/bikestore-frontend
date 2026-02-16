import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Truck, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-screen flex items-center justify-center text-center text-white bg-black">
        
        {/* Background Image - UPDATED TO LOCAL PNG */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60" 
          style={{ backgroundImage: "url('/motorcycle-bg.png')" }}
        ></div>
        
        {/* Content */}
        <div className="relative z-10 p-6 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
            Build Your Dream Machine
          </h1>
          
          <p className="text-base md:text-xl mb-8 text-gray-200 drop-shadow-md">
            The best aftermarket parts for your Bike. <br className="hidden md:block"/> Delivered straight to your doorstep.
          </p>
          
          <Link to="/products" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2 transition transform hover:scale-105 shadow-xl">
            Shop Now <ArrowRight />
          </Link>
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <div className="bg-white py-16 px-6">
        <div className="container mx-auto grid md:grid-cols-3 gap-8 text-center">
          
          <div className="p-6 border rounded-lg hover:shadow-lg transition group cursor-pointer">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition">
              <CheckCircle className="text-orange-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">High Performance</h3>
            <p className="text-gray-600">Every part is tested for speed, durability, and maximum efficiency.</p>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-lg transition group cursor-pointer">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition">
              <ShieldCheck className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Universal Fit</h3>
            <p className="text-gray-600">Components designed to fit all major brands including KTM & RE.</p>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-lg transition group cursor-pointer">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition">
              <Truck className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Shipping across India within 3-5 days with secure packaging.</p>
          </div>

        </div>
      </div>
    </div>
  );
}