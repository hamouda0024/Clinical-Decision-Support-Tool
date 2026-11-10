import { useState, type FormEvent } from 'react';
import type { AssessmentInput, CatalogResponse, VitalId } from '../../../shared/types';
import { EMPTY_FORM, toAssessmentInput, validateForm, type FormErrors, type FormState } from '../lib/form';
import { PRESETS } from '../lib/presets';
import { Activity, HeartPulse, RotateCcw, Stethoscope, User } from './Icons';
import { SymptomPicker } from './SymptomPicker';
import { VitalsFields } from './VitalsFields';

interface Props {
  catalog: CatalogResponse;
  loading: boolean;
  onSubmit: (input: AssessmentInput) => void;
  onResetResult: () => void;
}

const SEX_OPTIONS = [
  { value: 'male', label: 'ذكر' },
  { value: 'female', label: 'أنثى' },
  { value: 'other', label: 'آخر' },
] as const;

export function AssessmentForm({ catalog, loading, onSubmit, onResetResult }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const clearError = (key: keyof FormErrors) => {
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleSymptom = (id: string) => {
    setForm((current) => {
      const active = current.symptoms.includes(id);
      const nextSymptoms = active
        ? current.symptoms.filter((symptomId) => symptomId !== id)
        : [...current.symptoms, id];
      return { ...current, symptoms: nextSymptoms };
    });
    clearError('symptoms');
  };

  const updateVital = (id: VitalId, value: string) => {
    setForm((current) => ({ ...current, vitals: { ...current.vitals, [id]: value } }));
    clearError(id);
  };

  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find((entry) => entry.id === presetId);
    if (!preset) return;
    setForm(preset.form);
    setErrors({});
    setSummaryError(null);
    onResetResult();
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSummaryError(null);
    onResetResult();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForm(form, catalog.limits.maxSymptoms);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setSummaryError('تعذّر تحليل الحالة: راجع الحقول المميّزة بالأحمر ثم أعد المحاولة.');
      return;
    }
    setSummaryError(null);
    onSubmit(toAssessmentInput(form));
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-brand-700" />
            <h2 className="text-[14px] font-bold text-slate-900">نموذج تقييم المريض</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500">أمثلة سريعة:</span>
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                title={preset.hint}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-800"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6 p-5">
          {summaryError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[12.5px] text-rose-800"
            >
              <Activity className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{summaryError}</span>
            </div>
          )}

          {/* 1 — Patient profile */}
          <section aria-labelledby="section-patient">
            <div className="mb-3 flex items-center gap-2">
              <span className="section-kicker">1</span>
              <h3 id="section-patient" className="text-[13.5px] font-bold text-slate-800">
                بيانات المريض
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="age" className="label">
                  العمر (بالأعوام)
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  inputMode="numeric"
                  min={catalog.limits.minAge}
                  max={catalog.limits.maxAge}
                  value={form.age}
                  onChange={(event) => {
                    update('age', event.target.value);
                    clearError('age');
                  }}
                  className={`input ${errors.age ? 'input-error' : ''}`}
                  placeholder="مثال: 45"
                  aria-invalid={Boolean(errors.age)}
                  aria-describedby={errors.age ? 'age-error' : undefined}
                  required
                />
                {errors.age ? (
                  <p id="age-error" className="field-error">
                    {errors.age}
                  </p>
                ) : (
                  <p className="help">النطاق المدعوم: 0–120 سنة (البالغون أساس التقييم).</p>
                )}
              </div>

              <div>
                <label htmlFor="specialty" className="label">
                  الفئة الطبية / التخصص
                </label>
                <select
                  id="specialty"
                  name="specialty"
                  value={form.specialty}
                  onChange={(event) => {
                    update('specialty', event.target.value as FormState['specialty']);
                    clearError('specialty');
                  }}
                  className={`input ${errors.specialty ? 'input-error' : ''}`}
                  aria-invalid={Boolean(errors.specialty)}
                  required
                >
                  <option value="">— اختر التخصص —</option>
                  {catalog.specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.labelAr}
                    </option>
                  ))}
                </select>
                {errors.specialty && <p className="field-error">{errors.specialty}</p>}
              </div>

              <div>
                <span className="label" id="sex-label">
                  الجنس
                </span>
                <div role="radiogroup" aria-labelledby="sex-label" className="grid grid-cols-3 gap-2">
                  {SEX_OPTIONS.map((option) => (
                    <label key={option.value} className="relative">
                      <input
                        type="radio"
                        name="sex"
                        value={option.value}
                        checked={form.sex === option.value}
                        onChange={() => {
                          update('sex', option.value);
                          clearError('sex');
                        }}
                        className="peer sr-only"
                        required
                      />
                      <span className="flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white py-2.5 text-[12.5px] font-medium text-slate-700 transition select-none hover:border-brand-300 peer-checked:border-brand-600 peer-checked:bg-brand-50 peer-checked:font-semibold peer-checked:text-brand-800 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-500/20">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.sex && <p className="field-error">{errors.sex}</p>}
              </div>

              <div>
                <label htmlFor="duration" className="label">
                  مدة الأعراض
                </label>
                <div className="flex gap-2">
                  <input
                    id="duration"
                    name="duration"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={365}
                    step={1}
                    value={form.durationValue}
                    onChange={(event) => {
                      update('durationValue', event.target.value);
                      clearError('duration');
                    }}
                    className={`input flex-1 ${errors.duration ? 'input-error' : ''}`}
                    placeholder="مثال: 3"
                    aria-invalid={Boolean(errors.duration)}
                    required
                  />
                  <select
                    aria-label="وحدة مدة الأعراض"
                    value={form.durationUnit}
                    onChange={(event) =>
                      update('durationUnit', event.target.value as FormState['durationUnit'])
                    }
                    className="input w-28 shrink-0"
                  >
                    {catalog.durationUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.labelAr}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.duration && <p className="field-error">{errors.duration}</p>}
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 2 — Symptoms */}
          <section aria-labelledby="section-symptoms">
            <div className="mb-3 flex items-center gap-2">
              <span className="section-kicker">2</span>
              <h3 id="section-symptoms" className="text-[13.5px] font-bold text-slate-800">
                الأعراض الرئيسية (Chief Complaints)
              </h3>
            </div>
            <SymptomPicker
              symptoms={catalog.symptoms}
              groups={catalog.symptomGroups}
              selected={form.symptoms}
              onToggle={toggleSymptom}
              onClear={() => update('symptoms', [])}
              max={catalog.limits.maxSymptoms}
              error={errors.symptoms}
            />
            <p className="help mt-2">
              النقطة الحمراء تعني عرضاً قد يرتبط بحالة تحتاج تقييماً عاجلاً. اختر كل ما ينطبق على
              المريض.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* 3 — Vitals */}
          <section aria-labelledby="section-vitals">
            <div className="mb-3 flex items-center gap-2">
              <span className="section-kicker">3</span>
              <h3 id="section-vitals" className="text-[13.5px] font-bold text-slate-800">
                العلامات الحيوية
              </h3>
              <HeartPulse className="ms-auto h-4 w-4 text-rose-500" aria-hidden />
            </div>
            <VitalsFields
              definitions={catalog.vitals}
              values={form.vitals}
              errors={errors}
              onChange={updateVital}
            />
          </section>
        </div>
      </div>

      <div className="card flex flex-wrap items-center gap-3 p-4">
        <button type="submit" className="btn-primary min-w-44" disabled={loading}>
          {loading ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden
              />
              جارٍ التحليل…
            </>
          ) : (
            <>
              <Activity className="h-4 w-4" />
              تحليل الحالة
            </>
          )}
        </button>
        <button type="button" onClick={handleReset} className="btn-ghost" disabled={loading}>
          <RotateCcw className="h-4 w-4" />
          تفريغ النموذج
        </button>
        <p className="text-[11px] leading-relaxed text-slate-500 sm:ms-auto sm:max-w-64">
          <User className="mb-0.5 me-1 inline h-3.5 w-3.5" aria-hidden />
          لا تُدخل بيانات تعريفية (الاسم أو رقم الملف). الأداة لا تحتاجها ولا تحفظها.
        </p>
      </div>
    </form>
  );
}
