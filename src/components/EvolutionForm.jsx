import React, { useEffect, useState } from "react";
import { formatMutez } from "../lib/utils";
import Countdown from "./Countdown";
import MintButton from "./MintButton";
import RandomizeButton from "./RandomizeButton";

Number.prototype.mod = function (n) {
    "use strict";
    return ((this % n) + n) % n;
};

const alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";

function EvolutionForm({
    instantEvolutionFee,
    controlledEvolutionFee,
    nextEvolution,
    onEvolve,
}) {
    const [currentStep, setCurrentStep] = useState(0);
    const [freeEvolution, setFreeEvolution] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFreeEvolution(nextEvolution - new Date() < 0);
        }, 1000);
        return () => clearInterval(interval);
    }, [nextEvolution]);

    let handleNextStep = (e) => {
        e.preventDefault();
        setCurrentStep((currentStep + 1) % alphabet.length);
    };

    let handlePreviousStep = (e) => {
        e.preventDefault();
        setCurrentStep((currentStep - 1).mod(alphabet.length));
    };

    let handleEvolve = (e) => {
        e.preventDefault();
    };

    let handleControlledEvolve = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <form>
                <div>
                    <div>
                        <button
                            className="btn btn-default"
                            name="evolve"
                            id="evolve"
                            onClick={handleEvolve}
                        >
                            Evolve randomly (
                            {freeEvolution
                                ? "free"
                                : `${formatMutez(instantEvolutionFee)}`}
                            )
                        </button>
                    </div>
                    <div
                        style={{
                            overflowQrap: "break-word",
                            marginTop: "1vh",
                            marginBottom: "1vh",
                        }}
                    >
                        {!freeEvolution && (
                            <span>
                                Token can evolve again in{" "}
                                <Countdown targetDate={nextEvolution} />
                            </span>
                        )}
                    </div>
                    <fieldset>
                        <legend>Explore Evolution Steps</legend>
                        <div>
                            <button
                                className="btn btn-default"
                                name="previousStep"
                                id="previousStep"
                                onClick={handlePreviousStep}
                            >
                                ←
                            </button>
                            <button
                                className="btn btn-default"
                                name="nextStep"
                                id="nextStep"
                                onClick={handleNextStep}
                            >
                                →
                            </button>
                        </div>

                        <div>
                            <button
                                className="btn btn-default"
                                name="evolveControlled"
                                id="evolveControlled"
                                onClick={handleControlledEvolve}
                            >
                                Evolve controlled (
                                {freeEvolution
                                    ? `${formatMutez(controlledEvolutionFee)}`
                                    : `${formatMutez(
                                          instantEvolutionFee +
                                              controlledEvolutionFee
                                      )}`}
                                )
                            </button>
                        </div>
                    </fieldset>
                </div>
            </form>
        </div>
    );
}

export default EvolutionForm;
