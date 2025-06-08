
import React, { useState } from 'react';
import { useBalance } from '../contexts/BalanceContext';
import Button from '../components/ui/Button';
import DepositModal from '../components/profile/DepositModal';
import WithdrawModal from '../components/profile/WithdrawModal';
import TransactionList from '../components/profile/TransactionList';
import { CURRENCY_SYMBOL } from '../constants';
import { UserCircleIcon } from '../components/ui/icons/UserCircleIcon';

const ProfilePage: React.FC = () => {
  const { profile } = useBalance();
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="bg-white dark:bg-scrazino-gray-800 shadow-xl rounded-xl p-6 sm:p-8 text-center">
        <UserCircleIcon className="w-20 h-20 sm:w-24 sm:h-24 text-scrazino-yellow mx-auto mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold text-scrazino-gray-800 dark:text-scrazino-gray-100 mb-2">Мой профиль</h1>
        <p className="text-lg sm:text-xl text-scrazino-gray-600 dark:text-scrazino-gray-300">
          Текущий баланс: <span className="font-bold text-scrazino-yellow">{profile.balance.toLocaleString()} {CURRENCY_SYMBOL}</span>
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Button onClick={() => setDepositModalOpen(true)} size="lg" className="w-full sm:w-auto">
            Пополнить баланс
          </Button>
          <Button onClick={() => setWithdrawModalOpen(true)} variant="secondary" size="lg" className="w-full sm:w-auto">
            Вывести средства
          </Button>
        </div>
      </div>

      <TransactionList />

      <DepositModal isOpen={isDepositModalOpen} onClose={() => setDepositModalOpen(false)} />
      <WithdrawModal isOpen={isWithdrawModalOpen} onClose={() => setWithdrawModalOpen(false)} />
    </div>
  );
};

export default ProfilePage;
