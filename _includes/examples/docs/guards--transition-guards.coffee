class Scholar
  state @::, 'abstract'
    Matriculated: state 'initial'
      graduate: ( gpa ) ->
        @owner().gpa = gpa
        @$ -> 'Graduated'

    Graduated: state 'final'
  
    transitions:
      Summa: transition
        origin: 'Matriculated', target: 'Graduated'
        admit: -> @owner().gpa >= 3.9
        action: -> # swat down offers
  
      Magna: transition
        origin: 'Matriculated', target: 'Graduated'
        admit: -> 3.75 <= @owner().gpa < 3.9
        action: -> # choose internship
  
      Laude: transition
        origin: 'Matriculated', target: 'Graduated'
        admit: -> 3.50 <= @owner().gpa < 3.75
        action: -> # brag to the cat
  
      '': transition
        origin: 'Matriculated', target: 'Graduated'
        action: -> # blame rounding error

scholar = new Scholar
scholar.graduate 3.4999