import _cloneDeep from 'lodash.clonedeep';

const initialState = {
  hp: 10,
  maxHp: 10,
  damage: 3,
  defence: 0,
  level: 1,
  exp: 0,
  expToLevel: 20,
  gold: 0,
  equippedItems: {}
};

const statsReducer = (state = initialState, action) => {
  let newState;

  switch(action.type) {

    case 'GET_GOLD':
      // add gold to current gold
      return { ...state, gold: (state.gold + action.payload.value) };

    case 'LOSE_GOLD':
      // add gold to current gold
      return { ...state, gold: (state.gold - action.payload.value) };

    case 'UNEQUIP_ITEM':
      newState = _cloneDeep(state);
      let { data } = action.payload;
      // check the type
      switch(data.type) {
        case 'weapon':
          newState.damage -= data.damage;
          delete newState.equippedItems['weapon'];
          break;

        case 'armor::body':
          newState.defence -= data.defence;
          delete newState.equippedItems['armor']['body'];
          break;

        case 'armor::helmet':
          newState.defence -= data.defence;
          delete newState.equippedItems['armor']['helmet'];
          break;

        case 'armor::pants':
          newState.defence -= data.defence;
          delete newState.equippedItems['armor']['pants'];
          break;

        case 'armor::boots':
          newState.defence -= data.defence;
          delete newState.equippedItems['armor']['boots'];
          break;

        case 'armor::gloves':
          newState.defence -= data.defence;
          delete newState.equippedItems['armor']['gloves'];
          break;

        case 'ring':
          // iterate over each effect
          Object.keys(data.effect).forEach(effectName => {

            switch (effectName) {

              case 'defence':
                newState.defence -= data.effect[effectName];
                break;

              case 'damage':
                newState.damage -= data.effect[effectName];
                break;

              case 'hp':
                newState.hp -= data.effect[effectName];
                if(newState.hp < 1) newState.hp = 1;
                newState.maxHp -= data.effect[effectName];
                break;

              default:
            }
          });
          delete newState.equippedItems['ring'];

          break;

        default:
      }

      return newState;

    case 'EQUIP_ITEM':
      newState = _cloneDeep(state);
      let item = action.payload;
      // see what type of item it is
      switch(item.type) {

        case 'weapon':
          // if there's already a weapon
          if(newState.equippedItems['weapon']) {
            // subtract it's benefits
            newState.damage -= newState.equippedItems['weapon'].damage;
          }
          newState.damage += item.damage;
          newState.equippedItems['weapon'] = item;
          break;

        case 'armor::body':
          // if there's already armor
          if(newState.equippedItems['armor'] && newState.equippedItems['armor']['body']) {
            // subtract it's benefits
            newState.defence -= newState.equippedItems['armor']['body'].defence;
          }
          newState.defence += item.defence;
          // safely add new armor peice to object
          newState.equippedItems['armor'] = Object.assign({}, newState.equippedItems['armor'], { body: item });
          break;

        case 'armor::helmet':
          // if there's already armor
          if(newState.equippedItems['armor'] && newState.equippedItems['armor']['helmet']) {
            // subtract it's benefits
            newState.defence -= newState.equippedItems['armor']['helmet'].defence;
          }
          newState.defence += item.defence;
          // safely add new armor peice to object
          newState.equippedItems['armor'] = Object.assign({}, newState.equippedItems['armor'], { helmet: item });
          break;

        case 'armor::pants':
          // if there's already armor
          if(newState.equippedItems['armor'] && newState.equippedItems['armor']['pants']) {
            // subtract it's benefits
            newState.defence -= newState.equippedItems['armor']['pants'].defence;
          }
          newState.defence += item.defence;
          // safely add new armor peice to object
          newState.equippedItems['armor'] = Object.assign({}, newState.equippedItems['armor'], { pants: item });
          break;

        case 'armor::gloves':
          // if there's already armor
          if(newState.equippedItems['armor'] && newState.equippedItems['armor']['gloves']) {
            // subtract it's benefits
            newState.defence -= newState.equippedItems['armor']['gloves'].defence;
          }
          newState.defence += item.defence;
          // safely add new armor peice to object
          newState.equippedItems['armor'] = Object.assign({}, newState.equippedItems['armor'], { gloves: item });
          break;

        case 'armor::boots':
          // if there's already armor
          if(newState.equippedItems['armor'] && newState.equippedItems['armor']['boots']) {
            // subtract it's benefits
            newState.defence -= newState.equippedItems['armor']['boots'].defence;
          }
          newState.defence += item.defence;
          // safely add new armor peice to object
          newState.equippedItems['armor'] = Object.assign({}, newState.equippedItems['armor'], { boots: item });
          break;

        case 'ring':
          const equippedRing = newState.equippedItems['ring'];
          // if there's already a ring
          if(equippedRing) {
            // subtract it's benefits
            Object.keys(equippedRing.effect).forEach(effectName => {

              switch (effectName) {

                case 'defence':
                  newState.defence -= equippedRing.effect[effectName];
                  break;

                case 'damage':
                  newState.damage -= equippedRing.effect[effectName];
                  break;

                case 'hp':
                  newState.hp -= equippedRing.effect[effectName];
                  if(newState.hp < 1) newState.hp = 1;
                  newState.maxHp -= equippedRing.effect[effectName];
                  break;

                default:
              }
            });
          }

          // iterate over each new effect
          Object.keys(item.effect).forEach(effectName => {

            switch (effectName) {

              case 'defence':
                newState.defence += item.effect[effectName];
                break;

              case 'damage':
                newState.damage += item.effect[effectName];
                break;

              case 'hp':
                newState.hp += item.effect[effectName];
                newState.maxHp += item.effect[effectName];
                break;

              default:
            }
          });

          newState.equippedItems['ring'] = item;
          break;

        default:
      }
      return newState;

    case 'HEAL_HP':
      // heal the hp
      let _hp = state.hp + action.payload.value;
      // dont go above max hp
      if(_hp > state.maxHp) _hp = state.maxHp;

      return { ...state, hp: _hp };

    case 'DAMAGE_TO_PLAYER':
      const { damage } = action.payload;
      // deal damage to player
      return { ...state, hp: (state.hp - damage) };

    case 'GET_EXP':
      newState = _cloneDeep(state);
      const newExp = action.payload.value;
      const newTotalExp = state.exp + newExp;
      const { expToLevel } = state;
      // if they are leveling up
      if(newTotalExp >= expToLevel) {
        // increment level
        newState.level += 1;

        // calculate leftover exp if it isn't exactly enough
        if(!(newState.exp === expToLevel)) {
          let leftoverExp = (newTotalExp) % expToLevel;
          newState.exp = leftoverExp;
        }

        // set next exp goal to be 1.5 times as much if player is 5 or less
        if(newState.level < 6) {
          newState.expToLevel = Math.floor(state.expToLevel * 1.5);
        } else if(newState.level < 20) {
          // otherwise set it to be 1.25 times as much
          newState.expToLevel = Math.floor(state.expToLevel * 1.25);
        } else {
          // let the exp goal remain static at this point (lv 20+)
        }

        // get more maxHp and currHp (roll 1-5)
        let moreHp = Math.floor(Math.random() * 5) + 1;
        newState.hp += moreHp;
        newState.maxHp += moreHp;

        // get more damage (+1)
        newState.damage += 1;
        // 25% chance to get +2 damage on lv
        let chance = Math.floor(Math.random() * 100) + 1;
        if(chance <= 25) {
          newState.damage += 1;
        }
      }
      else {
        // they aren't leveling up
        newState.exp += newExp;
      }

      return newState;

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
};

export default statsReducer;
