/* eslint-disable @typescript-eslint/no-explicit-any */

export default function CustomInput({
  errors,
  register,
  type,
  label,
}: {
  errors: any;
  register: any;
  type: string;
  label: string;
}) {
  return (
    <>
      {errors.username && (
        <span className="text-lg text-red-700">{errors.username.message}</span>
      )}
      <input
        type={type}
        placeholder={label}
        className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none"
        {...register(label.toLocaleLowerCase(), { required: true })}
      />
    </>
  );
}
