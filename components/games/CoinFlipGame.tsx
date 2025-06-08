import React, { useState, useCallback } from 'react';
import { GameProps, TransactionType } from '../../types';
import Button from '../ui/Button';
import { CURRENCY_SYMBOL } from '../../constants';
import Spinner from '../ui/Spinner';

type Choice = 'Орел' | 'Решка'; // Translated

const Coin: React.FC<{ side: Choice | null, flipping: boolean }> = ({ side, flipping }) => {
  const coinBaseClass = "w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-xl border-4 border-scrazino-yellow-dark";
  const headsClass = "bg-gradient-to-br from-yellow-400 to-amber-600 text-black"; // Орел
  const tailsClass = "bg-gradient-to-br from-slate-400 to-gray-600 text-white"; // Решка

  let content = "?";
  let currentClass = "bg-scrazino-gray-300 dark:bg-scrazino-gray-700 text-black dark:text-white";

  if (side === 'Орел') {
    content = "О"; // Or "Орел" if space allows, "О" for short
    currentClass = headsClass;
  } else if (side === 'Решка') {
    content = "Р"; // Or "Решка", "Р" for short
    currentClass = tailsClass;
  }

  return (
    <div className={`perspective preserve-3d ${flipping ? 'animate-coin-flip' : ''}`}>
      <div className={`${coinBaseClass} ${currentClass} transition-all duration-300 ease-in-out ${flipping && side === 'Решка' ? 'rotate-y-180' : ''}`}>
        {content}
      </div>
    </div>
  );
};


const CoinFlipGame: React.FC<GameProps> = ({ onWin, onBet, currentBalance }) => {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<Choice | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [error, setError] = useState('');

  const handleFlip = useCallback(() => {
    if (!choice) {
      setError('Пожалуйста, выберите Орел или Решку.');
      return;
    }
    if (betAmount <= 0) {
      setError('Сумма ставки должна быть положительной.');
      return;
    }
    if (betAmount > currentBalance) {
      setError('Недостаточно средств для этой ставки.');
      return;
    }

    setError('');
    setMessage(null);
    setFlipping(true);
    onBet(betAmount, "Cyber Flip"); // English Name

    const outcome: Choice = Math.random() < 0.5 ? 'Орел' : 'Решка';
    
    setTimeout(() => {
      setResult(outcome);
      setFlipping(false);
      if (choice === outcome) {
        const winAmount = betAmount * 2; 
        onWin(winAmount, "Cyber Flip"); // English Name
        setMessage(`Выпало: ${outcome}! Вы выиграли ${betAmount.toLocaleString()} ${CURRENCY_SYMBOL}!`);
      } else {
        setMessage(`Выпало: ${outcome}. Повезет в следующий раз!`);
      }
      setChoice(null); 
    }, 1000); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choice, betAmount, currentBalance, onBet, onWin]);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setBetAmount(isNaN(val) || val < 1 ? 1 : val);
    if (error) setError('');
  };

  const quickBetAmounts = [10, 25, 50, 100, 250];

  return (
    <div className="flex flex-col items-center space-y-6 p-4 bg-scrazino-gray-50 dark:bg-scrazino-gray-800 rounded-lg shadow-inner">
      <Coin side={result} flipping={flipping} />

      {message && !flipping && (
        <p className={`text-lg sm:text-xl font-semibold ${message.includes('выиграли') ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
          {message}
        </p>
      )}
       {flipping && <Spinner />}


      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => { setChoice('Орел'); if(error) setError(''); setResult(null); setMessage(null); }}
            variant={choice === 'Орел' ? 'primary' : 'secondary'}
            size="lg"
            disabled={flipping}
            className="w-1/2"
          >
            Орел
          </Button>
          <Button
            onClick={() => { setChoice('Решка'); if(error) setError(''); setResult(null); setMessage(null); }}
            variant={choice === 'Решка' ? 'primary' : 'secondary'}
            size="lg"
            disabled={flipping}
            className="w-1/2"
          >
            Решка
          </Button>
        </div>

        <div className="flex items-center space-x-2">
            <label htmlFor="betAmountCoinFlip" className="text-sm font-medium text-scrazino-gray-700 dark:text-scrazino-gray-300 whitespace-nowrap">Сумма ставки:</label>
            <input
            type="number"
            id="betAmountCoinFlip"
            value={betAmount}
            onChange={handleBetChange}
            min="1"
            max={currentBalance}
            disabled={flipping}
            className="w-full px-3 py-2 border border-scrazino-gray-300 dark:border-scrazino-gray-600 rounded-lg shadow-sm focus:ring-scrazino-yellow focus:border-scrazino-yellow dark:bg-scrazino-gray-700 dark:text-white"
            />
        </div>
        <div className="grid grid-cols-5 gap-2">
            {quickBetAmounts.map(qb => (
                <Button key={qb} variant="secondary" size="sm" onClick={() => { setBetAmount(qb); if(error) setError(''); }} disabled={flipping || qb > currentBalance}>
                    {qb}
                </Button>
            ))}
        </div>
         {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}

        <Button
          onClick={handleFlip}
          disabled={!choice || flipping || betAmount <=0 || betAmount > currentBalance}
          isLoading={flipping}
          size="lg"
          className="w-full !text-xl"
        >
          БРОСИТЬ МОНЕТУ
        </Button>
      </div>
    </div>
  );
};

export default CoinFlipGame;