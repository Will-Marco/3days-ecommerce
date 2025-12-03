/* eslint-disable @typescript-eslint/no-explicit-any */

export default function CustomInput({
  errors,
  register,
  type,
  label,
  name,
  placeholder,
}: {
  errors: any;
  register: any;
  type: string;
  label: string;
  name: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col">
      {errors[name] && (
        <span className="text-sm text-red-600 mb-1">
          {errors[name]?.message}
        </span>
      )}

      <input
        type={type}
        placeholder={placeholder ?? label}
        className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none"
        {...register(name)}
      />
    </div>
  );
}
