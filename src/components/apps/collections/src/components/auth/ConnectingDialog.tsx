import { useAuth } from '../../auth/index';

const ConnectingDialog = () => {
  const { isConnecting } = useAuth();

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-[#212425] bg-opacity-70 z-50">
        <div
          className={`bg-white rounded-2xl py-8 w-[90%] md:w-1/2 xl:w-1/3 2xl:w-1/4 shadow-lg relative space-y-6 min-h-[400px]`}
        >
          <button className="absolute top-4 right-4 text-gray-400 text-2xl hover:text-gray-600">
            &times;
          </button>
          <div className="pt-6 pb-12 px-4 text-center">
            <div className="mb-8 font-semibold text-lg">Connecting...</div>
            <div className="flex items-center justify-center"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectingDialog;
