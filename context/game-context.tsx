import { PropsWithChildren, createContext } from "react";

export const GameContext = createContext({})

export default function GameProvider({ children }: PropsWithChildren){
  return <GameContext.Provider value ={{}}>{children}</ GameContext.Provider>
}
