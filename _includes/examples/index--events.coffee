class Mover
  state @::,
    Stationary:
      Idle: state 'initial'
      Alert: state
    Moving:
      Walking: state
      Running:
        Sprinting: state

  # Set up each state to log its transitional events.
  eventNames = ['depart', 'exit', 'enter', 'arrive']
  for substate in @::state().root.descendants()
    for eventName in eventNames
      do ( substate, eventName ) -> substate.on eventName, ->
        console.log "#{ eventName } #{ substate.name }"


m = new Mover

m.state '-> Alert'
# log <<< "depart Idle"
# log <<< "exit Idle"
# log <<< "enter Alert"
# log <<< "arrive Alert"

m.state '-> Sprinting'
# log <<< "depart Alert"
# log <<< "exit Alert"
# log <<< "exit Stationary"
# log <<< "enter Moving"
# log <<< "enter Running"
# log <<< "enter Sprinting"
# log <<< "arrive Sprinting"