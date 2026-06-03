"use client";

import { useRouter } from "next/navigation";
import ThemeSwitch from "../Themes/ThemeSwitcher";

function debounce<Args extends unknown[]>(
  fn: (...args: Args) => unknown,
  delay = 300,
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  return function (...args: Args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TopMenu({ query: _query }: { query?: string }) {
  const router = useRouter();

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;
      router.push(`/search?q=${search}`);
    },
  );

  // TODO: create and hook the search input to the handleSearch function
  //       make sure you are able to explain what the handleSearch is doing and what debounce does

  return (
    <div className="flex items-center gap-4 mb-4 mt-2">


      <form className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            onChange={handleSearch}
            className="
          w-full
          rounded-lg
          border border-gray-300 dark:border-gray-700
          bg-white dark:bg-gray-800
          px-4 py-2 pl-10
          text-sm
          text-gray-900 dark:text-white
          placeholder-gray-400
          focus:outline-none
          focus:ring-2 focus:ring-blue-500
          transition
        "
          />


          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </span>
        </div>
      </form>


      <div className="flex-shrink-0">
        <ThemeSwitch />
      </div>

    </div>
  );
}
