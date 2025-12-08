import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full relative bg-[url(/auth.jpeg)] bg-cover bg-center">
      
      {/* blur background */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/10"></div>

      {/* form center */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="bg-black/35 backdrop-blur-md text-white p-10 rounded-xl w-full max-w-md shadow-xl">
          <Outlet />   {/* أهم خطوة */}
        </div>
      </div>
    </div>
  );
}
