export function Loading() {
  return (
    <svg className="animate-spin h-5 w-5 ml-2 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="5"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.373A7.963 7.963 0 014 12H0c0 3.86 2.837 7.064 6.537 7.867L6 17.372z"></path>
    </svg>
  )
}
