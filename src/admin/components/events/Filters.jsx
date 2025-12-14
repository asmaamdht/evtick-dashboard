import { AiOutlineSearch } from "react-icons/ai";
import { useEffect, useState } from "react";


export default function Filters({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  handleSearch,
  resetFilters,
  autocomplete,
  setAutocomplete,
  applySuggestion,
}) {
const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">

       <div className="relative w-full sm:w-80">
           <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search event name, id, organizer id..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setAutocomplete([]); //hide suggestions on enter
              }
            }}
            className="
              appearance-none w-full px-3 py-2 rounded-lg border border-gray-300 pl-10
                 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 hover:border-teal-500
                 outline-none cursor-pointer
            "
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500 ">
           <AiOutlineSearch size={18} />
          </div>
            {/* autocomplete */}
            {autocomplete.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow z-10">
                {autocomplete.map(item => (
                  <div
                    key={item.id}
                    onClick={() => applySuggestion(item.eventName)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {item.eventName}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* category filter */}
        <div className="relative w-full sm:w-40 min-w-0">
        <div
            onClick={() => setOpen(!open)}
            className="px-2 py-1 sm:px-3 sm:py-2 rounded-lg w-full border border-gray-300
                    hover:border-teal-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500
                    outline-none cursor-pointer flex justify-between items-center
                    text-sm sm:text-base"
        >
            {category || "All Categories"}
            <span className="text-gray-500">▼</span>
        </div>

        {open && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow z-10 max-h-60 overflow-auto">
            <div
                onClick={() => { setCategory(""); setOpen(false); }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm sm:text-base"
            >
                All Categories
            </div>

            {categories.map((c) => (
                <div
                key={c}
                onClick={() => { setCategory(c); setOpen(false); }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm sm:text-base"
                >
                {c}
                </div>
            ))}
            </div>
        )}
        </div>

          {/*reset btn*/}
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg bg-teal-500 text-white w-full sm:w-auto"
          >
            Reset
          </button>
        </div>
  );
}
