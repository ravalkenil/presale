<div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-10">
<div
  className="relative bg-cover bg-center rounded-[30px] shadow-2xl w-full sm:w-[90%] max-w-3xl"
  style={{ backgroundImage: `url(${background})` }}
>
  <div className="absolute inset-0 bg-gradient-to-br from-[#1c45f2] to-[#7f0599] opacity-90 rounded-[30px]"></div>

  <div className="relative p-6 sm:p-8 md:p-10 text-white rounded-[30px] shadow-lg">
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center font-sans mb-4 sm:mb-6 text-shadow">
      🚀 Time until presale ends
    </h1>

    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        Object.keys(timeLeft).map((unit) => (
          <div
            key={unit}
            className="bg-white text-black font-thin element rounded-2xl py-2 sm:py-4 px-2 sm:px-4 text-center shadow-[0_10px_30px_rgba(0,0,0,0.6)] w-20 sm:w-24 md:w-34 h-12 sm:h-14 md:h-16 flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-105"
          >
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold font-sansman">
              {timeLeft[unit]}
              {unit.charAt(0).toLowerCase() + unit.slice(7)}
            </p>
          </div>
        ))
      )}
    </div>

    <div className="mb-4 sm:mb-6 flex flex-col items-center">
      <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 font-sans text-center">
        Total USDC Raised in Presale:
      </h2>
      <div className="relative w-full sm:w-4/5 bg-gray-300 h-8 sm:h-10 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.6)] overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#6DE922] to-[#C1F126] h-full transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-center mt-2 font-medium font-sans text-sm">
        You purchased $CROTCH = {Math.floor(Crotchtoken).toLocaleString()}
      </p>
    </div>

    <h3 className="text-lg sm:text-xl font-semibold font-sans text-center mb-3">
      Choose your payment method
    </h3>

    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
      {["ETH", "CRO", "USDC", "CARD"].map((method) => (
        <div
          key={method}
          className={`bg-white p-3 sm:p-4 md:p-6 w-24 sm:w-28 md:w-28 h-10 sm:h-12 md:h-14 rounded-2xl cursor-pointer transition-transform duration-200 transform hover:scale-105 ${
            selectedPaymentMethod === method
              ? "bg-gradient-to-br from-[#C1F126] to-[#C1F126]"
              : ""
          } flex items-center justify-center`}
          onClick={() => setSelectedPaymentMethod(method)}
        >
          <img
            src={imageMapping[method]}
            alt={method}
            className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7"
          />
          <p className="text-center font-sans text-xs sm:text-sm md:text-base text-black font-bold">
            {method}
          </p>
        </div>
      ))}
    </div>

    <div className="flex items-center justify-center my-4">
      <hr className="w-28 sm:w-36 border-white" />
      <p className="text-center text-xs sm:text-sm font-sans mx-2 sm:mx-4">
        1 $CROTCH = $0.000075
      </p>
      <hr className="w-28 sm:w-36 border-white" />
    </div>

    <div className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-16 mb-8">
      <div className="w-full md:w-2/3 lg:w-1/3 relative bg-transparent md:mb-4 lg:mb-0">
        <div className="flex flex-row justify-between mb-2 font-sans font-medium text-xs">
          <p>Amount you pay in {selectedPaymentMethod}</p>
          <p
            className="underline font-sans cursor-pointer"
            onClick={maxsendtoken}
          >
            MAX
          </p>
        </div>

        <div className="relative">
          <input
            type="number"
            placeholder="0"
            value={usdcInput}
            onChange={handleInputChange}
            className="w-full py-4 sm:py-5 px-4 sm:px-5 font-extrabold bg-transparent block element rounded-lg text-xl sm:text-2xl bg-slate-100 text-black text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ backgroundColor: "rgba(241, 245 ,249, 0.8)" }}
          />
          <img
            src={imageMapping[selectedPaymentMethod]}
            alt={selectedPaymentMethod}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 pointer-events-none"
          />
        </div>
      </div>

      <div className="w-full sm:w-2/3 lg:w-1/3 relative">
        <div className="flex flex-row justify-between mb-2 font-medium font-sans text-xs">
          <p>Amount Received in $CROTCH</p>
          <p className="underline font-sans cursor-pointer">MAX</p>
        </div>

        <div className="relative">
          <input
            type="number"
            placeholder="0"
            value={tokenReceived}
            readOnly
            className="w-full py-4 sm:py-5 px-4 sm:px-5 rounded-lg element text-black font-extrabold shadow-lg text-xl sm:text-2xl transition-colors block text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ backgroundColor: "rgba(241, 245 ,249, 0.8)" }}
          />
          <img
            src={bgcover}
            alt={selectedPaymentMethod}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 pointer-events-none"
          />
        </div>
      </div>
    </div>

    <p className="text-center font-sans text-sm sm:text-lg mb-4 sm:mb-6">
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      Your USDC Balance: ${totalbalnce} {selectedPaymentMethod}
    </p>

    <div className="text-center">
      {isConnected || address ? (
        <div className="flex flex-col items-center">
          {BuyLoading ? (
            <button className="px-16 sm:px-20 py-3 bg-gradient-to-r from-[#6DE922] to-[#C1F126] text-black font-extrabold rounded-full shadow-lg hover:scale-105 transition-transform duration-200">
              <div className="spinner-border animate-spin inline-block w-5 h-5 border-4 rounded-full border-t-transparent border-[#000000]"></div>
            </button>
          ) : (
            <button
              onClick={buyTokens}
              className="px-12 sm:px-14 py-3 bg-gradient-to-r from-[#6DE922] to-[#C1F126] text-black font-extrabold rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
            >
              Buy Tokens
            </button>
          )}

          <button className="px-2 mt-2 py-3 bg-gradient-to-r from-[#29333b] to-[#272921] text-black font-extrabold rounded-full shadow-lg hover:scale-105 transition-transform duration-200">
            <w3m-account-button />
          </button>
        </div>
      ) : (
        <div>
          <w3m-connect-button />
        </div>
      )}
    </div>
  </div>
</div>
</div>