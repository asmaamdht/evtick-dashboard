import React from 'react'

function PageTitle({ title }) {

    const PageTitle = (title) => {
        if (!title) return "";
        return title
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    }

    return (
        <div className="text-lg font-semibold text-gray-700">
            {PageTitle(title)}
        </div>
    )
}

export default PageTitle