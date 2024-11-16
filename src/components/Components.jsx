/* eslint-disable react/prop-types */

export const Button = ({ children, type = 'button', ...props }) => (
    <button
        type={type}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out"
        {...props}
    >
        {children}
    </button>
);

export const Input = ({ label, type = 'text', ...props }) => (
    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
        <input
            type={type}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-200"
            {...props}
        />
    </div>
);

export const AuthCard = ({ children, title }) => (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-w-max">
        <div className="max-w-md w-full space-y-8 bg-slate-50 p-8 rounded-xl shadow-lg">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            </div>
            {children}
        </div>
    </div>
);
