const Reminder: React.FC = () => (
  <div className="self-stretch justify-start items-start gap-2 inline-flex mt-6 md:mt-2">
    <div className="w-[18px] h-[18px] relative">
      <div className="w-[18px] h-[18px] left-0 top-0 absolute bg-[#e1e1e1] rounded-full" />
      <div className="w-[18px] left-0 top-[1px] absolute text-center text-[#69737c] text-[13px] font-bold">
        i
      </div>
    </div>
    <div className="grow shrink basis-0 opacity-70 text-[#6e6d66] text-[13px] font-light">
      Reminder: This is a peer-to-peer gold purchase, with pricing set by the gold bar's owner.
    </div>
  </div>
);

export default Reminder;
