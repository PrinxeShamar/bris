import {getParsedStatement, getString} from "../../Parser.js";

export function DistributionVerifier(parsedStatement1, parsedStatement2) {
  if (getString(parsedStatement2).length > getString(parsedStatement1).length) {
    return (Distribution(parsedStatement1, parsedStatement2));
  } else if (getString(parsedStatement1).length > getString(parsedStatement2).length) {
    return (Distribution(parsedStatement2, parsedStatement1));
  } else {
    return (Distribution(parsedStatement2, parsedStatement1) || Distribution(parsedStatement1, parsedStatement2));
  }
}

function Distribution(parsedStatement1, parsedStatement2) {
  let connective1 = parsedStatement1.type;
  let allAtomic = true;
  for (let i = 0; i < parsedStatement1.parts.length; i++) {
    if (parsedStatement1.parts[i].type !== "ATOMIC") {
      allAtomic = false;
      break;
    }
  }
  if (allAtomic) {
    return false
  }
  let newStrBool = true;
  for (let i = 0; i < parsedStatement1.parts.length-1; i++) {
    if (parsedStatement1.parts[i].type !== "ATOMIC" && (parsedStatement1.parts[i].type !== parsedStatement1.parts[i+1].type)) {
      newStrBool = false;
    }
  }
  let newStr = DistributionHelper(parsedStatement1.parts[0], parsedStatement1.parts[1], connective1);
  let distStr2 = DistributionHelper2(parsedStatement1.parts[0], parsedStatement1.parts[1], connective1);
  if (((newStr === getString(parsedStatement2)) && newStrBool) || (distStr2 === getString(parsedStatement2)) && (parsedStatement1.parts.length === 2)) {
    return true
  }
  for (let i = 1; i<parsedStatement1.parts.length-1; i++) {
    newStr = DistributionHelper(getParsedStatement(newStr), parsedStatement1.parts[i+1], connective1);
    distStr2 = DistributionHelper2(parsedStatement1.parts[0], parsedStatement1.parts[i+1], connective1);
  }
  if (((newStr === getString(parsedStatement2)) && newStrBool) || (distStr2 === getString(parsedStatement2))) {
    return true;
  }
  return false;
}

function DistributionHelper(LHS, RHS, connective1) {
  let distString = "(";
  if (LHS.type === "ATOMIC" && RHS.type === "ATOMIC") {
    distString += "(" + getString(LHS.parts[0]) + connective1 + getString(RHS.parts[0]) + ")";
  } else if ((LHS.type !== "NOT") && (RHS.type !== "NOT")) {
    for (let i = 0; i < LHS.parts.length; i++) {
      for (let j = 0; j < RHS.parts.length; j++) {
        if ((i !== LHS.parts.length-1) || (j !== RHS.parts.length-1)) {
          if (LHS.type !== "ATOMIC" && RHS.type !== "ATOMIC") {
            distString += "(" + getString(LHS.parts[i]) + connective1 + getString(RHS.parts[j]) + ")" + LHS.type;
          } else if (LHS.type !== "ATOMIC" && RHS.type === "ATOMIC") {
            distString += "(" + getString(LHS.parts[i]) + connective1 + RHS.parts[j] + ")" + LHS.type;
          } else if (LHS.type === "ATOMIC" && RHS.type !== "ATOMIC") {
            distString += "(" + LHS.parts[i] + connective1 + getString(RHS.parts[j]) + ")" + RHS.type;
          }
        } else {
          if (LHS.type !== "ATOMIC" && RHS.type !== "ATOMIC") {
            distString += "(" + getString(LHS.parts[i]) + connective1 + getString(RHS.parts[j]) + ")";
          } else if (LHS.type !== "ATOMIC" && RHS.type === "ATOMIC") {
            distString += "(" + getString(LHS.parts[i]) + connective1 + RHS.parts[j] + ")";
          } else if (LHS.type === "ATOMIC" && RHS.type !== "ATOMIC") {
            distString += "(" + LHS.parts[i] + connective1 + getString(RHS.parts[j]) + ")";
          }
        }
      }
    }
  }
  distString += ")";
  distString = distString.replaceAll("AND", "&");
  distString = distString.replaceAll("OR", "|");
  distString = distString.replaceAll("NOT", "~");
  return distString;
}

function DistributionHelper2(LHS, RHS, connective1) {
  let distString = "(";
  if (LHS.type === "ATOMIC" && RHS.type === "ATOMIC") {
    distString += "(" + getString(LHS.parts[0]) + connective1 + getString(RHS.parts[0]) + ")";
  } else if ((LHS.type !== "NOT") && (RHS.type !== "NOT")) {
    for (let j = 0; j < RHS.parts.length; j++) {
      if (j !== RHS.parts.length-1) {
        if (LHS.type !== "ATOMIC" && RHS.type !== "ATOMIC") {
          distString += "(" + getString(LHS) + connective1 + getString(RHS.parts[j]) + ")" + RHS.type;
        } else if (LHS.type !== "ATOMIC" && RHS.type === "ATOMIC") {
          distString += "(" + getString(LHS) + connective1 + RHS.parts[j] + ")" + LHS.type;
        } else if (LHS.type === "ATOMIC" && RHS.type !== "ATOMIC") {
          distString += "(" + LHS + connective1 + getString(RHS.parts[j]) + ")" + RHS.type;
        }
      } else {
        if (LHS.type !== "ATOMIC" && RHS.type !== "ATOMIC") {
          distString += "(" + getString(LHS) + connective1 + getString(RHS.parts[j]) + ")";
        } else if (LHS.type !== "ATOMIC" && RHS.type === "ATOMIC") {
          distString += "(" + getString(LHS) + connective1 + RHS.parts[j] + ")";
        } else if (LHS.type === "ATOMIC" && RHS.type !== "ATOMIC") {
          distString += "(" + LHS + connective1 + getString(RHS.parts[j]) + ")";
        }
      }
    }
  }
  distString += ")";
  distString = distString.replaceAll("AND", "&");
  distString = distString.replaceAll("OR", "|");
  distString = distString.replaceAll("NOT", "~");
  return distString;
}