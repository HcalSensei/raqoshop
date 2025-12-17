import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4">
      {/* Header du Formulaire */}
      <div className="mb-8">
        <div className="mb-6 flex justify-start">
          <img
            src="./images/logo/logo.png"
            alt="Logo"
            className="w-auto transition-transform duration-300 hover:scale-105"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-black dark:text-white sm:text-3xl mb-3">
          Content de vous revoir !
        </h1>
        <p className="text-base font-medium text-gray-500 dark:text-gray-400">
          Connectez-vous à votre compte pour continuer.
        </p>
      </div>

      {/* Formulaire */}
      <form className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Label className="font-medium text-black dark:text-white">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input 
              type="email"
              placeholder="votre@email.com" 
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/10 border-gray-300 dark:border-strokedark"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label className="font-medium text-black dark:text-white">
              Mot de passe <span className="text-red-500">*</span>
            </Label>
            <div className="relative group">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Entrez votre mot de passe"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/10 border-gray-300 dark:border-strokedark pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-gray-400 hover:text-primary transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeIcon className="size-5" />
                ) : (
                  <EyeCloseIcon className="size-5" />
                )}
              </button>
            </div>
          </div>

          {/* Options: Remember & Forgot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox 
                id="remember"
                checked={isChecked} 
                onChange={setIsChecked} 
              />
              <label 
                htmlFor="remember"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer group-hover:text-black dark:group-hover:text-white transition-colors"
              >
                Rester connecté
              </label>
            </div>
            <Link
              to="/reset-password"
              className="text-sm font-medium text-primary hover:text-opacity-80 transition-opacity"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button 
              className="w-full bg-primary hover:bg-opacity-90 text-white font-semibold py-3 rounded-lg transition-all duration-300 active:scale-[0.98] shadow-sm" 
              size="lg"
            >
              Se connecter
            </Button>
          </div>
        </div>
      </form>

      {/* Footer / Support */}
      <div className="mt-8 text-center sm:text-left">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Vous rencontrez des difficultés ? {""}
          <Link
            to="/support"
            className="text-primary font-bold hover:underline transition-all"
          >
            Contacter le support
          </Link>
        </p>
      </div>
    </div>
  );
}