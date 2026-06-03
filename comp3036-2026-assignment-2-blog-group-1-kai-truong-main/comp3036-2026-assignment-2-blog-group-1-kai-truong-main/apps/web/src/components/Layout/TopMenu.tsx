"use client";

import { useRouter } from "next/navigation";
import ThemeSwitch from "../Themes/ThemeSwitcher";

function debounce<T extends (...args: Any[]) => Any>(fn: T, delay = 300) {
  let timeoutId: Any;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function TopMenu({ query }: { query?: string }) {
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


          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </form>


      <div className="flex-shrink-0">
        <ThemeSwitch />
      </div>

    </div>
  );
}
