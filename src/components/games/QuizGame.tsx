import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { CiberMascot } from '../CiberMascot';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup } from '../../types';

interface QuizGameProps {
  onComplete: () => void;
  ageGroup?: ChildAgeGroup;
}

export const QuizGame: React.FC<QuizGameProps> = ({ onComplete, ageGroup = '8–10' }) => {
  const { language } = useLanguage();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const localizedQuestions = {
    es: {
      title: '¿Por qué nunca debes compartir tu ubicación en tiempo real en historias públicas?',
      mechanicTag: 'Trivia Visual',
      subTitle: 'Decisión de Ciberdefensa',
      quickBadge: 'Pregunta Rápida',
      mascotText: 'Ciber dice: "Tómate tu tiempo. Aprender no es competir por velocidad, sino entender el porqué de cada regla."',
      completeBtn: '¡Completar y Guardar Puntos!',
      selectBtn: 'Selecciona la respuesta más segura',
      options: [
        {
          text: 'Porque cualquiera puede saber exactamente dónde estás en ese mismo instante.',
          isCorrect: true,
          feedback: '¡Exactamente! La ubicación en vivo permite que extraños conozcan tus rutinas. Es mejor compartir anécdotas cuando ya estás a salvo en casa.',
        },
        {
          text: 'Porque consume mucha batería en el celular.',
          isCorrect: false,
          feedback: 'Aunque consume batería, el motivo de ciberseguridad prioritario es proteger tu privacidad física y la de tu familia.',
        },
        {
          text: 'Porque las fotos se ven más oscuras.',
          isCorrect: false,
          feedback: '¡No afecta la calidad de la foto! Lo importante es mantener en secreto los lugares que visitas a solas.',
        },
        {
          text: 'Solo tus amigos del colegio pueden verla, así que no hay problema.',
          isCorrect: false,
          feedback: 'En historias públicas o con cuentas abiertas, cualquier persona de la red puede mirar tus historias.',
        },
      ],
    },
    fr: {
      title: 'Pourquoi ne devrais-tu jamais partager ta localisation en direct sur des stories publiques ?',
      mechanicTag: 'Quiz Visuel',
      subTitle: 'Décision de Cyberdéfense',
      quickBadge: 'Question Rapide',
      mascotText: 'Ciber dit : "Prends ton temps. Apprendre n’est pas une course de vitesse, mais comprendre le sens de chaque règle."',
      completeBtn: 'Terminer et Enregistrer les Points !',
      selectBtn: 'Choisis la réponse la plus sûre',
      options: [
        {
          text: 'Parce que n’importe qui peut savoir exactement où tu te trouves à cet instant.',
          isCorrect: true,
          feedback: 'Exactement ! La localisation en direct permet à des inconnus de connaître tes habitudes. Il vaut mieux partager des souvenirs une fois rentré chez toi.',
        },
        {
          text: 'Parce que cela consomme trop de batterie sur le smartphone.',
          isCorrect: false,
          feedback: 'Bien que cela consomme de la batterie, la raison de sécurité primordiale est de préserver ta vie privée physique et celle de ta famille.',
        },
        {
          text: 'Parce que les photos deviennent plus sombres.',
          isCorrect: false,
          feedback: 'Cela n’affecte pas la qualité ! L’essentiel est de garder secrets les endroits où tu te déplaces seul.',
        },
        {
          text: 'Seuls tes camarades de classe peuvent la voir, donc aucun danger.',
          isCorrect: false,
          feedback: 'Sur des comptes publics ou ouverts, n’importe quel internaute peut consulter tes stories.',
        },
      ],
    },
    en: {
      title: 'Why should you never share your real-time location in public stories?',
      mechanicTag: 'Visual Trivia',
      subTitle: 'Cyber Defense Decision',
      quickBadge: 'Quick Question',
      mascotText: 'Ciber says: "Take your time. Learning is not a race for speed, but about understanding why safety rules exist."',
      completeBtn: 'Complete & Save Points!',
      selectBtn: 'Select the safest answer',
      options: [
        {
          text: 'Because anyone can see exactly where you are at that very moment.',
          isCorrect: true,
          feedback: 'Exactly! Live location broadcasts your habits to strangers. It is always safer to post memories after you are safely back home.',
        },
        {
          text: 'Because it drains phone battery too fast.',
          isCorrect: false,
          feedback: 'While it uses battery, the primary cyber safety priority is protecting your physical privacy and your family.',
        },
        {
          text: 'Because photos appear darker.',
          isCorrect: false,
          feedback: 'It doesn’t affect photo quality! The critical goal is keeping your visited locations private.',
        },
        {
          text: 'Only classmates can see it, so there is no risk.',
          isCorrect: false,
          feedback: 'On public accounts or open stories, anyone on the internet can see your broadcasts.',
        },
      ],
    },
  };

  const currentQ = localizedQuestions[language] || localizedQuestions.en || localizedQuestions.es;

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    setFeedback(currentQ.options[idx].feedback);
  };

  const isSuccess = selectedIdx !== null && currentQ.options[selectedIdx].isCorrect;

  return (
    <div className="flex-1 min-h-0 flex flex-col p-5 sm:p-6 bg-slate-50 text-slate-800 select-none overflow-y-auto scrollbar-none space-y-6 sm:space-y-7 pb-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold text-sky-600 tracking-wider">
              {currentQ.mechanicTag}
            </div>
            <h2 className="text-base font-black text-slate-900">{currentQ.subTitle}</h2>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-600">
          {currentQ.quickBadge}
        </span>
      </div>

      {/* Mascot advice */}
      <div className="flex items-center gap-3.5 p-4 bg-sky-50/80 rounded-3xl border border-sky-100">
        <CiberMascot size="sm" expression={isSuccess ? 'celebrating' : 'thinking'} />
        <div className="text-xs sm:text-sm text-sky-950 leading-relaxed">
          {currentQ.mascotText}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-sm font-black text-slate-900 leading-snug">
          {currentQ.title}
        </h3>

        <div className="space-y-2 pt-1">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
                      : 'bg-amber-50 border-amber-300 ring-2 ring-amber-200'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <span className="text-xs font-semibold text-slate-800">{opt.text}</span>
                {isSelected && opt.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-2xl text-xs font-medium ${
              isSuccess ? 'bg-emerald-50 border border-emerald-200 text-emerald-950' : 'bg-sky-50 border border-sky-200 text-sky-950'
            }`}
          >
            {feedback}
          </motion.div>
        )}
      </div>

      {/* Action CTA */}
      <button
        onClick={onComplete}
        disabled={!isSuccess}
        className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
          isSuccess
            ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20 active:scale-95'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        <Sparkles className="w-4 h-4" />
        <span>{isSuccess ? currentQ.completeBtn : currentQ.selectBtn}</span>
      </button>
    </div>
  );
};
