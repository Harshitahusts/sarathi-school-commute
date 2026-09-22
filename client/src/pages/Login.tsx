import { FormEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  HeartHandshake,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type UserProfile = {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
};

type LoginProps = {
  onComplete: (profile: UserProfile) => void;
};

const passwordRules = [
  { label: "8+ characters", test: (value: string) => value.length >= 8 },
  {
    label: "Upper & lowercase",
    test: (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value),
  },
  { label: "A number", test: (value: string) => /\d/.test(value) },
  {
    label: "A special character",
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
];

export default function Login({ onComplete }: LoginProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const passedRules = useMemo(
    () => passwordRules.map(rule => rule.test(form.password)),
    [form.password]
  );
  const score = passedRules.filter(Boolean).length;
  const strength = score >= 4 ? "strong" : score >= 2 ? "medium" : "weak";
  const strengthLabel = form.password
    ? `${strength[0].toUpperCase()}${strength.slice(1)} password`
    : "Build your password";
  const phoneValid = /^[0-9\s()+-]{10,}$/.test(form.mobile.replace(/\s/g, ""));
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const formValid = Boolean(
    form.firstName && form.lastName && phoneValid && emailValid && score === 4
  );

  const update = (field: keyof typeof form, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
    if (submitted) setSubmitted(false);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (!formValid) return;
    onComplete({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      mobile: form.mobile.trim(),
      email: form.email.trim().toLowerCase(),
    });
  };

  return (
    <main className="login-page">
      <div className="login-orbit login-orbit-one" />
      <div className="login-orbit login-orbit-two" />
      <section className="login-shell" aria-label="Create your Sarathi account">
        <div className="login-brand-row">
          <div className="login-brand-mark">
            <HeartHandshake size={21} strokeWidth={2.4} />
          </div>
          <div>
            <div className="login-brand-name">sarathi</div>
            <div className="login-brand-tag">care in motion</div>
          </div>
          <div className="login-secure-pill">
            <LockKeyhole size={13} /> Private by design
          </div>
        </div>

        <div className="login-grid">
          <div className="login-copy">
            <div className="login-eyebrow">
              <Sparkles size={14} /> YOUR SAFER COMMUTE STARTS HERE
            </div>
            <h1>
              Strong routines.
              <br />
              <span>Stronger peace of mind.</span>
            </h1>
            <p className="login-intro">
              Create your Sarathi profile to see every school commute, handoff,
              and human confirmation in one calm place.
            </p>
            <div
              className={`strength-visual strength-${strength}`}
              aria-label={`Password strength visual: ${strength}`}
            >
              <div className="strength-visual-image" />
              <div className="strength-visual-copy">
                <span className={`strength-badge strength-badge-${strength}`}>
                  {strengthLabel}
                </span>
                <strong>
                  {strength === "strong"
                    ? "Your account is ready to protect."
                    : strength === "medium"
                      ? "Keep going — add the final layer."
                      : "A little more strength keeps your account safer."}
                </strong>
                <div className="strength-meter" aria-hidden="true">
                  {[1, 2, 3, 4].map(level => (
                    <span
                      key={level}
                      className={
                        score >= level ? `meter-on meter-${strength}` : ""
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="login-trust-row">
              <ShieldCheck size={17} />
              <span>
                Encrypted profile details · no cabin media · human-led safety
                decisions
              </span>
            </div>
          </div>

          <form className="login-card" onSubmit={submit} noValidate>
            <div className="login-card-heading">
              <div>
                <div className="login-card-kicker">WELCOME TO SARATHI</div>
                <h2>Create your profile</h2>
              </div>
              <span className="login-step">
                1 <small>/ 1</small>
              </span>
            </div>
            <p className="login-card-subtitle">
              Use your details so your safety desk knows who to reach.
            </p>

            <div className="login-form-grid">
              <label className="login-field">
                <span>First name</span>
                <input
                  value={form.firstName}
                  onChange={event => update("firstName", event.target.value)}
                  placeholder="Harshit"
                  autoComplete="given-name"
                  required
                />
              </label>
              <label className="login-field">
                <span>Last name</span>
                <input
                  value={form.lastName}
                  onChange={event => update("lastName", event.target.value)}
                  placeholder="Gupta"
                  autoComplete="family-name"
                  required
                />
              </label>
            </div>
            <label className="login-field">
              <span>Mobile number</span>
              <input
                value={form.mobile}
                onChange={event => update("mobile", event.target.value)}
                placeholder="+91 98765 43210"
                inputMode="tel"
                autoComplete="tel"
                required
              />
              <small>Used only for staffed commute support.</small>
            </label>
            <label className="login-field">
              <span>Email address</span>
              <input
                type="email"
                value={form.email}
                onChange={event => update("email", event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>
            <label className="login-field">
              <span>Create password</span>
              <div className="password-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={event => update("password", event.target.value)}
                  placeholder="Make it memorable and strong"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-visibility"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(value => !value)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>
            <div className="password-rules" aria-live="polite">
              {passwordRules.map((rule, index) => (
                <span
                  key={rule.label}
                  className={passedRules[index] ? "rule-passed" : ""}
                >
                  {passedRules[index] && <Check size={12} />}
                  {rule.label}
                </span>
              ))}
            </div>
            {submitted && !formValid && (
              <p className="login-error" role="alert">
                Add valid contact details and complete all four password
                strength checks.
              </p>
            )}
            <button className="login-submit" type="submit">
              Enter my safety view <ArrowRight size={17} />
            </button>
            <p className="login-legal">
              By continuing, you agree to receive essential safety updates from
              Sarathi. You can change preferences later.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export type { UserProfile };
