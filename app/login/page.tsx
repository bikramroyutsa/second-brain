import GoogleSignin from "@/components/GoogleSignIn"
export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white-900">Sign in</h1>
        <p className="text-gray-500">Welcome back! Please choose a method.</p>
      </div>

      <GoogleSignin />
      
    </div>
  )
}