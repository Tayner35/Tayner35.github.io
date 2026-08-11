import { cell } from './data-shared.js';

export const airwayRows = Object.freeze([
  {
    id: 'tracheal-stenosis',
    disease: 'Tracheal stenosis',
    aliases: ['fixed upper airway obstruction', 'fixed tracheal narrowing'],
    mechanism: 'A rigid narrowed tracheal segment limits maximal flow in both directions regardless of the respiratory phase.',
    cells: {
      type: cell('Fixed central airway obstruction', 'The stenotic segment has a fixed caliber and cannot expand during inspiration or expiration, so both limbs are flow limited.'),
      insp: cell('Flattened / plateau', 'Inspiratory flow reaches the fixed mechanical limit of the stenotic lumen, producing a plateau rather than a normal rounded inspiratory limb.'),
      exp: cell('Flattened / plateau', 'Expiratory flow is limited by the same fixed lumen, so the expiratory limb also plateaus.'),
      ratio: cell('N/↓', 'Because both inspiratory and expiratory flow are capped, FEV₁/FVC may remain near normal; severe stenosis can lower FEV₁ enough to reduce the ratio.'),
      tlc: cell('N', 'An isolated tracheal lesion limits flow but does not reduce the size or compliance of the distal lungs, so TLC is usually normal.'),
      rv: cell('N', 'The distal lung and small airways are intact, so complete slow emptying can still reach a normal RV despite the flow limitation.'),
      dlco: cell('N', 'The alveolar-capillary membrane is unaffected by an isolated tracheal stenosis, so DLCO remains normal.'),
    },
  },
  {
    id: 'central-airway-tumor',
    disease: 'Central airway tumor',
    aliases: ['tracheal tumor', 'fixed central lesion'],
    mechanism: 'A sufficiently rigid central mass creates a fixed bottleneck that limits maximal inspiratory and expiratory flow.',
    cells: {
      type: cell('Fixed central airway obstruction', 'A rigid intraluminal or compressive tumor can hold the central airway at a fixed narrow diameter through both phases of breathing.'),
      insp: cell('Flattened / plateau', 'Inspiratory flow cannot exceed the fixed opening created by the tumor, causing inspiratory plateauing.'),
      exp: cell('Flattened / plateau', 'The same fixed opening caps expiratory flow and flattens the expiratory limb.'),
      ratio: cell('N/↓', 'Both FEV₁ and FVC can be affected by the bottleneck, so the ratio may be preserved; more severe expiratory limitation can reduce it.'),
      tlc: cell('N', 'If the lesion is isolated and the distal lung remains ventilated, total lung capacity is not intrinsically altered.'),
      rv: cell('N', 'A central fixed lesion usually changes flow more than static volume, so RV is typically normal unless secondary air trapping develops.'),
      dlco: cell('N', 'Central airway narrowing alone does not damage alveolar surface area or pulmonary capillary blood volume, leaving DLCO normal.'),
    },
  },
  {
    id: 'vocal-cord-paralysis',
    disease: 'Vocal cord paralysis',
    aliases: ['variable extrathoracic obstruction', 'upper airway obstruction'],
    mechanism: 'The extrathoracic airway narrows during inspiration when subatmospheric intraluminal pressure pulls the unsupported segment inward.',
    cells: {
      type: cell('Variable extrathoracic obstruction', 'The obstruction changes with respiratory phase because pressure around the extrathoracic airway remains atmospheric while intraluminal pressure becomes subatmospheric during inspiration.'),
      insp: cell('Flattened', 'During inspiration, pressure inside the extrathoracic airway falls below atmospheric pressure, tending to collapse the narrowed segment and cap inspiratory flow.'),
      exp: cell('Relatively preserved', 'During expiration, positive pressure inside the airway splints the extrathoracic segment open, so the expiratory limb is much less affected.'),
      ratio: cell('Usually N', 'FEV₁ is measured during expiration, which is relatively preserved in a variable extrathoracic obstruction, so FEV₁/FVC is usually normal.'),
      tlc: cell('N', 'The lesion alters upper-airway flow but does not change distal lung compliance or maximum static volume, so TLC remains normal.'),
      rv: cell('N', 'Expiratory emptying is relatively preserved and the distal small airways are intact, so RV is usually normal.'),
      dlco: cell('N', 'The alveolar-capillary interface is unaffected, so diffusing capacity remains normal.'),
    },
  },
  {
    id: 'tracheomalacia',
    disease: 'Tracheomalacia',
    aliases: ['variable intrathoracic obstruction', 'dynamic tracheal collapse'],
    mechanism: 'Weak intrathoracic tracheal walls collapse when positive pleural pressure exceeds airway pressure during forced expiration.',
    cells: {
      type: cell('Variable intrathoracic obstruction', 'The degree of narrowing changes with intrathoracic pressure: inspiration tends to splint the airway open, while forced expiration compresses it.'),
      insp: cell('Relatively preserved', 'During inspiration, pleural pressure becomes more negative and the pressure inside the airway exceeds surrounding pressure, helping hold the malacic segment open.'),
      exp: cell('Flattened', 'During forced expiration, pleural pressure becomes positive and compresses the weak intrathoracic trachea, limiting flow and flattening the expiratory limb.'),
      ratio: cell('N/↓', 'The expiratory limb is affected, so FEV₁ can fall and reduce the ratio; mild disease may leave conventional spirometric indices near normal despite the loop abnormality.'),
      tlc: cell('N', 'Isolated tracheomalacia changes dynamic flow rather than distal lung size, so TLC is usually normal.'),
      rv: cell('N', 'Static residual volume is usually normal when the distal small airways and lung parenchyma are otherwise healthy.'),
      dlco: cell('N', 'Tracheal wall weakness does not alter the alveolar-capillary membrane, so DLCO remains normal.'),
    },
  },
]);
