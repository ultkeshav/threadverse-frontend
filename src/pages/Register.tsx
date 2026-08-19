import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    // Password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Phone validation
    if (
      phone.length > 0 &&
      !/^\d{10}$/.test(phone)
    ) {
      setError(
        "Phone number must contain exactly 10 digits.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await register(
        firstName,
        lastName,
        email,
        phone,
        password,
      );

      // After successful registration, go to Home
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFCFA]">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        {/* Left Visual Panel */}
        <div className="hidden bg-[#FFF8F2] p-10 lg:flex lg:flex-col lg:justify-between">
          <Link
            to="/"
            className="text-xl font-black tracking-[-0.06em]"
          >
            THREAD
            <span className="text-[#F28C28]">
              VERSE
            </span>
          </Link>

          <div className="max-w-lg">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E97917]">
              Join ThreadVerse
            </p>

            <h1 className="mt-5 text-6xl font-black leading-none tracking-[-0.06em]">
              Create your
              <span className="block text-[#F28C28]">
                universe.
              </span>
            </h1>

            <p className="mt-6 leading-7 text-[#737373]">
              Create your account and start exploring
              ThreadVerse.
            </p>

            <div className="mt-10 h-px w-24 bg-[#F28C28]" />
          </div>

          <p className="text-xs text-[#A1A1A1]">
            Anime × Streetwear × Identity
          </p>
        </div>

        {/* Registration Form */}
        <div className="flex items-center justify-center px-5 py-12 sm:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
            }}
            className="w-full max-w-md"
          >
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#737373] transition hover:text-[#E97917]"
            >
              <ArrowLeft size={16} />
              Back to ThreadVerse
            </Link>

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F28C28]">
              Create account
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em]">
              Welcome to ThreadVerse.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#737373]">
              Create your account and become part of the
              universe.
            </p>

            {/* Error */}
            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
              >
                {error}
              </motion.div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-5"
            >
              {/* First + Last Name */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-semibold"
                  >
                    First name
                  </label>

                  <input
                    id="firstName"
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(
                        event.target.value,
                      )
                    }
                    required
                    autoComplete="given-name"
                    placeholder="Keshav"
                    className="w-full rounded-2xl border border-[#E5E5E0] bg-white px-4 py-4 text-sm text-[#171717] outline-none transition placeholder:text-[#A1A1A1] focus:border-[#F28C28] focus:ring-4 focus:ring-[#FFF3E8]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Last name
                  </label>

                  <input
                    id="lastName"
                    value={lastName}
                    onChange={(event) =>
                      setLastName(
                        event.target.value,
                      )
                    }
                    required
                    autoComplete="family-name"
                    placeholder="Kumar"
                    className="w-full rounded-2xl border border-[#E5E5E0] bg-white px-4 py-4 text-sm text-[#171717] outline-none transition placeholder:text-[#A1A1A1] focus:border-[#F28C28] focus:ring-4 focus:ring-[#FFF3E8]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="registerEmail"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email
                </label>

                <input
                  id="registerEmail"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-[#E5E5E0] bg-white px-4 py-4 text-sm text-[#171717] outline-none transition placeholder:text-[#A1A1A1] focus:border-[#F28C28] focus:ring-4 focus:ring-[#FFF3E8]"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold"
                >
                  Phone
                  <span className="ml-1 text-xs font-normal text-[#9A9A94]">
                    optional
                  </span>
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value.replace(
                        /\D/g,
                        "",
                      ),
                    )
                  }
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="9876543210"
                  className="w-full rounded-2xl border border-[#E5E5E0] bg-white px-4 py-4 text-sm text-[#171717] outline-none transition placeholder:text-[#A1A1A1] focus:border-[#F28C28] focus:ring-4 focus:ring-[#FFF3E8]"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="registerPassword"
                  className="mb-2 block text-sm font-semibold"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="registerPassword"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value,
                      )
                    }
                    required
                    autoComplete="new-password"
                    placeholder="Create a password"
                    className="w-full rounded-2xl border border-[#E5E5E0] bg-white px-4 py-4 pr-12 text-sm text-[#171717] outline-none transition placeholder:text-[#A1A1A1] focus:border-[#F28C28] focus:ring-4 focus:ring-[#FFF3E8]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737373] transition hover:text-[#E97917]"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value,
                      )
                    }
                    required
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    className="w-full rounded-2xl border border-[#E5E5E0] bg-white px-4 py-4 pr-12 text-sm text-[#171717] outline-none transition placeholder:text-[#A1A1A1] focus:border-[#F28C28] focus:ring-4 focus:ring-[#FFF3E8]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737373] transition hover:text-[#E97917]"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#171717] px-5 py-4 text-sm font-bold text-white transition duration-300 hover:bg-[#F28C28] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Creating account..."
                  : "Create account"}

                {!isSubmitting && (
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-8 text-center text-sm text-[#737373]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-[#E97917] transition hover:text-[#F28C28] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Register;